import { createContext, Dispatch, useCallback, useContext, useReducer, useState } from "react";
import { UserSession } from "@/lib/types/user";
import { Theme } from "@/types/theme";
import { DEFAULT_THEME, PageSiteConfig } from "@/services/siteConstant";

export type ISiderMenu =
  | "dashboard"
  | "home"
  | "certifications"
  | "quiz"
  | "setting"
  | "notification"
  | "academy"
  | "users"
  | "faqa"
  | "testimonials"
  | "content"
  | (string & {})
  | "configuration";
export type IResponsiveNavMenu = "dashboard" | "academy" | "setting" | "notification";

export type ChatContext = {
  conversationId?: string;
  userMessageContent?: string;
  content?: string;
  sessionId?: string;
  isLoading: boolean;
};
// Define your state type
type AppState = {
  notifications?: number;
  selectedSiderMenu: ISiderMenu;
  session?: UserSession;
  responsiveSideNav?: boolean;
  theme?: Theme;
  pageLoading?: boolean;
  selectedResponsiveMenu?: IResponsiveNavMenu;
  onlineStatus?: boolean;
  collapsed?: boolean;
  chatList: any[];
  lessonCollapsed?: boolean;
  appLoaded?: boolean;
  siteConfig: PageSiteConfig;
  chatContent: string;
  appendChat: (chunk: string) => void;
  clearChat: () => void;
  chatContext: ChatContext;
};

interface AIChatContextType {
  responseContent: string;
  query: string;
  isStreaming: boolean;
  error: string | null;
  setQuery: (query: string) => void;
  appendResponse: (chunk: string) => void;
  clearResponse: () => void;
  setStreamingStatus: (status: boolean) => void;
  setError: (error: string | null) => void;
}

// Define your action type
export type AppAction =
  | { type: "SET_NAVBAR_MENU"; payload: IResponsiveNavMenu }
  | { type: "SET_USER"; payload: UserSession }
  | { type: "SET_SELECTED_SIDER_MENU"; payload: ISiderMenu }
  | { type: "SWITCH_THEME"; payload: Theme }
  | { type: "SET_ONLINE_STATUS"; payload: boolean }
  | { type: "SET_LOADER"; payload: boolean }
  | { type: "SET_LESSON_COLLAPSED"; payload: boolean }
  | { type: "SET_RESPONSIVE_SIDE_NAV"; payload: boolean }
  | { type: "SET_SITE_CONFIG"; payload: PageSiteConfig }
  | { type: "SET_COLLAPSED"; payload: boolean }
  | { type: "SET_APP_LOADED"; payload: boolean }
  | { type: "SET_CHAT_LIST"; payload: any[] }
  | { type: "SET_CHAT_CONTEXT"; payload: ChatContext };

// Define the initial state
const initialState: AppState = {
  selectedSiderMenu: "home",
  pageLoading: true,
  onlineStatus: true,
  selectedResponsiveMenu: "dashboard",
  collapsed: false,
  responsiveSideNav: false,
  lessonCollapsed: false,
  siteConfig: DEFAULT_THEME,
  chatContent: "",
  appLoaded: false,
  chatList: [],
  appendChat: (chunk: string) => {},
  clearChat: () => {},
  chatContext: {
    isLoading: false,
  },
};

// Create the context
const AppContext = createContext<{
  globalState: AppState;
  chatContext: AIChatContextType | undefined;
  dispatch: Dispatch<AppAction>;
}>({
  globalState: initialState,
  chatContext: undefined,
  dispatch: () => undefined,
});

// Create a provider component
export const AppProvider: React.FC<{ children: any }> = ({ children }) => {
  const [responseContent, setAIResponseContent] = useState<string>("");
  const [isStreaming, setIsStreaming] = useState<boolean>(false);
  const [error, setErrorState] = useState<string | null>(null);
  const [query, setUserQuery] = useState<string>("");

  const appendResponse = useCallback((chunk: string) => {
    setAIResponseContent((prev) => prev + chunk);
  }, []);

  const setQuery = useCallback((query: string) => {
    setUserQuery(query);
  }, []);

  const clearResponse = useCallback(() => {
    setAIResponseContent("");
    setErrorState(null);
  }, []);

  const setStreamingStatus = useCallback((status: boolean) => {
    setIsStreaming(status);
  }, []);

  const setError = useCallback((err: string | null) => {
    setErrorState(err);
  }, []);

  const chatContextValue = {
    responseContent,
    isStreaming,
    error,
    query,
    setQuery,
    appendResponse,
    clearResponse,
    setStreamingStatus,
    setError,
  };
  const [globalState, dispatch] = useReducer((currentState: AppState, action: AppAction) => {
    switch (action.type) {
      case "SET_USER":
        return { ...currentState, session: action.payload };
      case "SET_SELECTED_SIDER_MENU":
        return { ...currentState, selectedSiderMenu: action.payload };
      case "SET_NAVBAR_MENU":
        return { ...currentState, selectedResponsiveMenu: action.payload };
      case "SET_RESPONSIVE_SIDE_NAV":
        return { ...currentState, responsiveSideNav: action.payload };
      case "SET_ONLINE_STATUS":
        return { ...currentState, onlineStatus: action.payload };
      case "SET_APP_LOADED":
        return { ...currentState, appLoaded: action.payload };
      case "SET_LOADER":
        return { ...currentState, pageLoading: action.payload };
      case "SET_COLLAPSED":
        return { ...currentState, collapsed: action.payload };
      case "SET_CHAT_CONTEXT":
        if (action.payload.content) {
          return {
            ...currentState,
            chatContext: {
              ...currentState.chatContext,
              isLoading: true,
              content:
                typeof currentState.chatContext.content == "undefined"
                  ? action.payload.content
                  : currentState.chatContext.content + action.payload.content,
            },
          };
        } else {
          return { ...currentState, chatContext: action.payload };
        }
      case "SET_LESSON_COLLAPSED":
        return { ...currentState, lessonCollapsed: action.payload };
      case "SET_SITE_CONFIG":
        return { ...currentState, siteConfig: action.payload };
      case "SET_CHAT_LIST":
        return { ...currentState, chatList: action.payload };
      case "SWITCH_THEME":
        let mainHTML = document.getElementsByTagName("html").item(0);

        if (mainHTML != null) {
          mainHTML.setAttribute("data-theme", action.payload);
        }
        return { ...currentState, theme: action.payload };

      default:
        return currentState;
    }
  }, initialState);

  return (
    <AppContext.Provider value={{ globalState, chatContext: chatContextValue, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};

// Custom hook to access the context
export const useAppContext = () => useContext(AppContext);
