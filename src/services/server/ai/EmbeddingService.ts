import appConstant from "@/services/appConstant";
import { KnowledgeSourceType } from "@prisma/client";
import { QdrantClient } from "@qdrant/js-client-rest";
import OpenAI from "openai";
import { v4 as uuidv4 } from "uuid";

export interface EmbeddingConfig {
  openaiApiKey: string;
  qdrantUrl: string;
  qdrantApiKey?: string;
  embeddingModel?: string;
  vectorSize?: number;
}

export interface EmbeddingDocument {
  id?: string;
  sourceType?: KnowledgeSourceType;
  text: string;
  metadata?: Record<string, any>;
}

export interface ChunkingOptions {
  chunkSize?: number;
  chunkOverlap?: number;
  separators?: string[];
  keepSeparator?: boolean;
}

export interface SearchResult {
  id: string;
  text: string;
  score: number;
  metadata?: any;
}

export class EmbeddingService {
  private openai: OpenAI;
  private qdrant: QdrantClient;
  private embeddingModel: string;
  private vectorSize: number;
  private defaultChunkingOptions: ChunkingOptions;

  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPEN_API_KEY!,
    });

    this.qdrant = new QdrantClient({
      url: `http://${process.env.QDRANT_HOST}:${process.env.QDRANT_PORT}`,
    });

    this.embeddingModel = "text-embedding-3-small";
    this.vectorSize = 1536; // Default for text-embedding-3-small

    // Default chunking options
    this.defaultChunkingOptions = {
      chunkSize: 1000,
      chunkOverlap: 200,
      separators: ["\n\n", "\n", ". ", "! ", "? ", " "],
      keepSeparator: true,
    };
  }

  /**
   * Split text into chunks based on separators and size limits
   */
  private splitTextIntoChunks(text: string, options?: ChunkingOptions): string[] {
    const opts = { ...this.defaultChunkingOptions, ...options };
    const { chunkSize, chunkOverlap, separators, keepSeparator } = opts;

    if (text.length <= chunkSize!) {
      return [text];
    }

    const chunks: string[] = [];
    let currentChunk = "";

    // First, try to split by separators
    let splits = [text];

    for (const separator of separators!) {
      const newSplits: string[] = [];
      for (const split of splits) {
        if (split.length <= chunkSize!) {
          newSplits.push(split);
        } else {
          const parts = split.split(separator);
          for (let i = 0; i < parts.length; i++) {
            const part = parts[i];
            if (i < parts.length - 1 && keepSeparator) {
              newSplits.push(part + separator);
            } else {
              newSplits.push(part);
            }
          }
        }
      }
      splits = newSplits;
    }

    // Now combine splits into chunks
    for (const split of splits) {
      if (split.trim().length === 0) continue;

      if (currentChunk.length + split.length <= chunkSize!) {
        currentChunk += split;
      } else {
        if (currentChunk.trim().length > 0) {
          chunks.push(currentChunk.trim());
        }
        currentChunk = split;
      }
    }

    if (currentChunk.trim().length > 0) {
      chunks.push(currentChunk.trim());
    }

    // Add overlap between chunks if specified
    if (chunkOverlap! > 0 && chunks.length > 1) {
      const overlappedChunks: string[] = [];
      for (let i = 0; i < chunks.length; i++) {
        let chunkWithOverlap = chunks[i];

        // Add overlap from previous chunk
        if (i > 0 && chunkOverlap! > 0) {
          const prevChunk = chunks[i - 1];
          const overlapText = prevChunk.slice(-chunkOverlap!);
          chunkWithOverlap = overlapText + " " + chunkWithOverlap;
        }

        overlappedChunks.push(chunkWithOverlap);
      }
      return overlappedChunks;
    }

    return chunks;
  }

  /**
   * Generate collection name based on tenant ID
   */
  private getCollectionName(tenantId: string): string {
    return `embeddings_${tenantId}`;
  }

  /**
   * Create or ensure collection exists for a tenant
   */
  async ensureCollection(tenantId: string): Promise<void> {
    const collectionName = this.getCollectionName(tenantId);

    try {
      // Check if collection exists
      await this.qdrant.getCollection(collectionName);
    } catch (error) {
      // Collection doesn't exist, create it
      await this.qdrant.createCollection(collectionName, {
        vectors: {
          size: this.vectorSize,
          distance: "Cosine",
        },
      });
    }
  }

  /**
   * Generate embedding for text using OpenAI
   */
  async generateEmbedding(text: string): Promise<number[]> {
    try {
      const response = await this.openai.embeddings.create({
        model: this.embeddingModel,
        input: text,
      });

      return response.data[0].embedding;
    } catch (error) {
      console.error("Error generating embedding:", error);
      throw new Error(`Failed to generate embedding: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
  }

  /**
   * Add a single document to the collection (with automatic chunking)
   */
  async addDocument(
    tenantId: string,
    document: EmbeddingDocument,
    chunkingOptions?: ChunkingOptions
  ): Promise<string[]> {
    await this.ensureCollection(tenantId);

    const collectionName = this.getCollectionName(tenantId);
    const baseId = document.id || uuidv4();

    // Split text into chunks
    const chunks = this.splitTextIntoChunks(document.text, chunkingOptions);
    const points = [];
    const ids: string[] = [];

    // Create embeddings for each chunk
    for (let i = 0; i < chunks.length; i++) {
      const chunkId = chunks.length === 1 ? baseId : uuidv4();
      const embedding = await this.generateEmbedding(chunks[i]);

      points.push({
        id: chunkId,
        vector: embedding,
        payload: {
          text: chunks[i],
          originalDocumentId: baseId,
          totalChunks: chunks.length,
          chunkIndex: i,
          metadata: document.metadata,
        },
      });

      ids.push(chunkId);
    }
    try {
      await this.qdrant.upsert(collectionName, { points });
      return ids;
    } catch (error) {
      console.error("Error adding document:", error);
      throw new Error(`Failed to add document: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
  }

  /**
   * Add multiple documents to the collection (with automatic chunking)
   */
  async addDocuments(
    tenantId: string,
    documents: EmbeddingDocument[],
    chunkingOptions?: ChunkingOptions
  ): Promise<string[]> {
    await this.ensureCollection(tenantId);

    const collectionName = this.getCollectionName(tenantId);
    const points = [];
    const allIds: string[] = [];

    // Process each document and its chunks
    for (const document of documents) {
      const baseId = document.id || uuidv4();
      const chunks = this.splitTextIntoChunks(document.text, chunkingOptions);

      for (let i = 0; i < chunks.length; i++) {
        const chunkId = chunks.length === 1 ? baseId : uuidv4();
        const embedding = await this.generateEmbedding(chunks[i]);

        points.push({
          id: chunkId,
          vector: embedding,
          payload: {
            text: chunks[i],
            originalDocumentId: baseId,
            chunkIndex: i,
            totalChunks: chunks.length,
            metadata: document.metadata,
          },
        });

        allIds.push(chunkId);
      }
    }

    try {
      await this.qdrant.upsert(collectionName, { points });
      console.log(
        `${documents.length} documents processed into ${points.length} chunks and added to collection ${collectionName}`
      );
      return allIds;
    } catch (error) {
      console.error("Error adding documents:", error);
      throw new Error(`Failed to add documents: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
  }

  private async shouldSearchPersonalData(query: string) {
    const genericQueries = [
      "how are you",
      "hello",
      "hi",
      "thanks",
      "thank you",
      "what is your name",
      "who are you",
      "help",
      "what can you do",
    ];

    const normalizedQuery = query.toLowerCase().trim();
    if (genericQueries.some((generic) => normalizedQuery.includes(generic))) {
      return false;
    }

    if (query.trim().split(" ").length < 3) {
      return false;
    }

    return true;
  }

  async search(tenantId: string, query: string): Promise<SearchResult[]> {
    const collectionName = this.getCollectionName(tenantId);
    const queryEmbedding = await this.generateEmbedding(query);

    try {
      if (await this.shouldSearchPersonalData(query)) {
        const searchResult = await this.qdrant.search(collectionName, {
          vector: queryEmbedding,
          limit: 5,
          with_payload: true,
          score_threshold: 0.4,
        });
        const results = searchResult.map((result) => ({
          id: result.id.toString(),
          text: result.payload?.text as string,
          score: result.score,
          metadata: result?.payload?.metadata,
        }));

        return results;
      } else {
        return [];
      }
    } catch (error: any) {
      console.error("Error searching documents:", error.message);
      return [];
    }
  }

  /**
   * Get document by ID
   */
  async getDocument(tenantId: string, documentId: string): Promise<SearchResult | null> {
    const collectionName = this.getCollectionName(tenantId);

    try {
      const result = await this.qdrant.retrieve(collectionName, {
        ids: [documentId],
        with_payload: true,
      });

      if (result.length === 0) {
        return null;
      }

      const point = result[0];
      return {
        id: point.id.toString(),
        text: point.payload?.text as string,
        score: 1.0, // No score for direct retrieval
        metadata: point.payload ? { ...point.payload, text: undefined } : undefined,
      };
    } catch (error) {
      console.error("Error retrieving document:", error);
      return null;
    }
  }

  /**
   * Delete document by original document ID (deletes all chunks)
   */
  async deleteDocument(tenantId: string, documentId: string): Promise<void> {
    try {
      const response = await this.qdrant.collectionExists(this.getCollectionName(tenantId));
      if (response.exists) {
        await this.deleteDocumentChunks(tenantId, documentId);
      } else {
        console.warn(`Collection ${this.getCollectionName(tenantId)} does not exist`);
      }
    } catch (error: any) {
      console.error("Error deleting document:", error.message);
      throw error;
    }
  }

  /**
   * Delete multiple documents by original document IDs (deletes all chunks)
   */
  async deleteDocuments(tenantId: string, documentIds: string[]): Promise<void> {
    const response = await this.qdrant.collectionExists(this.getCollectionName(tenantId));
    if (response.exists) {
      for (const documentId of documentIds) {
        await this.deleteDocumentChunks(tenantId, documentId);
      }
    } else {
      console.warn(`Collection ${this.getCollectionName(tenantId)} does not exist`);
    }
  }

  /**
   * Get all chunks for a specific document
   */
  async getDocumentChunks(tenantId: string, originalDocumentId: string): Promise<SearchResult[]> {
    const collectionName = this.getCollectionName(tenantId);

    try {
      const searchResult = await this.qdrant.scroll(collectionName, {
        filter: {
          must: [
            {
              key: "originalDocumentId",
              match: { value: originalDocumentId },
            },
          ],
        },
        with_payload: true,
        limit: 1000,
      });

      return searchResult.points.map((point) => ({
        id: point.id.toString(),
        text: point.payload?.text as string,
        score: 1.0,
        metadata: point.payload ? { ...point.payload, text: undefined } : undefined,
      }));
    } catch (error) {
      console.error("Error retrieving document chunks:", error);
      return [];
    }
  }

  /**
   * Get full document by reconstructing from chunks
   */
  async getFullDocument(tenantId: string, originalDocumentId: string): Promise<SearchResult | null> {
    const chunks = await this.getDocumentChunks(tenantId, originalDocumentId);

    if (chunks.length === 0) {
      return null;
    }

    // If we have the full text stored, use it; otherwise reconstruct from chunks
    const firstChunk = chunks[0];
    const fullText = firstChunk.metadata?.fullText || chunks.map((chunk) => chunk.text).join(" ");

    return {
      id: originalDocumentId,
      text: fullText,
      score: 1.0,
      metadata: {
        ...firstChunk.metadata,
        totalChunks: chunks.length,
        text: undefined,
        fullText: undefined,
      },
    };
  }

  /**
   * Update document (with automatic chunking)
   */
  async updateDocument(
    tenantId: string,
    documentId: string,
    document: Omit<EmbeddingDocument, "id">,
    chunkingOptions?: ChunkingOptions
  ): Promise<string[]> {
    const collectionName = this.getCollectionName(tenantId);

    // First, delete existing chunks for this document
    try {
      await this.deleteDocumentChunks(tenantId, documentId);
    } catch (error) {
      console.warn(`Warning: Could not delete existing chunks for document ${documentId}:`, error);
    }

    // Add the updated document with chunking
    const newIds = await this.addDocument(tenantId, { ...document, id: documentId }, chunkingOptions);

    return newIds;
  }

  /**
   * Delete all chunks for a specific document
   */
  async deleteDocumentChunks(tenantId: string, originalDocumentId: string): Promise<void> {
    const collectionName = this.getCollectionName(tenantId);

    try {
      // Search for all chunks belonging to this document
      const searchResult = await this.qdrant.scroll(collectionName, {
        filter: {
          must: [
            {
              key: "originalDocumentId",
              match: { value: originalDocumentId },
            },
          ],
        },
        with_payload: false,
        limit: 1000, // Adjust based on expected max chunks per document
      });

      if (searchResult.points.length > 0) {
        const chunkIds = searchResult.points.map((point) => point.id);
        await this.qdrant.delete(collectionName, { points: chunkIds });
        console.log(`Deleted ${chunkIds.length} chunks for document ${originalDocumentId}`);
      }
    } catch (error) {
      console.error("Error deleting document chunks:", error);
      throw new Error(`Failed to delete document chunks: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
  }

  /**
   * Delete entire collection for a tenant
   */
  async deleteCollection(tenantId: string): Promise<void> {
    const collectionName = this.getCollectionName(tenantId);

    try {
      await this.qdrant.deleteCollection(collectionName);
    } catch (error) {
      console.error("Error deleting collection:", error);
      throw new Error(`Failed to delete collection: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
  }

  /**
   * Get collection info
   */
  async getCollectionInfo(tenantId: string) {
    const collectionName = this.getCollectionName(tenantId);

    try {
      return await this.qdrant.getCollection(collectionName);
    } catch (error) {
      console.error("Error getting collection info:", error);
      throw new Error(`Failed to get collection info: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
  }

  /**
   * Count documents in collection
   */
  async countDocuments(tenantId: string): Promise<number> {
    const collectionName = this.getCollectionName(tenantId);

    try {
      const info = await this.qdrant.getCollection(collectionName);
      return info.points_count || 0;
    } catch (error) {
      console.error("Error counting documents:", error);
      throw new Error(`Failed to count documents: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
  }
}

export default new EmbeddingService();
