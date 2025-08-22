import {
  EmbedStep,
  getDocusaurusInstructions,
  getMintlifyInstructions,
  getNextraInstructions,
  getReadTheDocsInstructions,
  getWebflowInstructions,
  getWordpressInstructions,
} from "./instructions";

export function getPlatformEmbedInstructions({
  agentId,
  position,
  platform,
  embedPath,
}: {
  agentId: string;
  position: string;
  platform: string;
  embedPath: string;
}): EmbedStep[] {
  switch (platform) {
    case "nextra":
      return getNextraInstructions(agentId, position, embedPath);
    case "docusaurus":
      return getDocusaurusInstructions(agentId, position, embedPath);
    case "mintlify":
      return getMintlifyInstructions(agentId, position, embedPath);
    case "webflow":
      return getWebflowInstructions(agentId, position, embedPath);
    case "wordpress":
      return getWordpressInstructions(agentId, position, embedPath);
    case "readthedocs":
      return getReadTheDocsInstructions(agentId, position, embedPath);
    default:
      return [
        {
          title: "Unsupported Platform",
          description: "The specified platform is not currently supported.",
        },
      ];
  }
}
