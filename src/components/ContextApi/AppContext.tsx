import { createContext, Dispatch, useContext, useReducer } from "react";
import { INotification } from "@/lib/types/discussions";
import { UserSession } from "@/lib/types/user";
import { Theme } from "@/types/theme";
import { DEFAULT_THEME, PageSiteConfig } from "@/services/siteConstant";

export type ISiderMenu =
  | "dashboard"
  | "courses"
  | "certifications"
  | "events"
  | "quiz"
  | "setting"
  | "notification"
  | "academy"
  | "users"
  | "content"
  | "addCourseForm"
  | "configuration";
export type IResponsiveNavMenu = "dashboard" | "courses" | "academy" | "events" | "blogs" | "setting" | "notification";

// Define your state type
type AppState = {
  notifications?: number;
  selectedSiderMenu: ISiderMenu;
  session?: UserSession;
  theme?: Theme;
  pageLoading?: boolean;
  selectedResponsiveMenu?: IResponsiveNavMenu;
  onlineStatus?: boolean;
  collapsed?: boolean;
  lessonCollapsed?: boolean;
  siteConfig: PageSiteConfig;
};

// Define your action type
export type AppAction =
  | { type: "SET_UNREAD_NOTIFICATION"; payload: number }
  | { type: "GET_NOTIFICATION"; payload: INotification[] }
  | { type: "SET_NAVBAR_MENU"; payload: IResponsiveNavMenu }
  | { type: "SET_USER"; payload: UserSession }
  | { type: "SET_SELECTED_SIDER_MENU"; payload: ISiderMenu }
  | { type: "SWITCH_THEME"; payload: Theme }
  | { type: "SET_ONLINE_STATUS"; payload: boolean }
  | { type: "SET_LOADER"; payload: boolean }
  | { type: "SET_LESSON_COLLAPSED"; payload: boolean }
  | { type: "SET_SITE_CONFIG"; payload: PageSiteConfig }
  | { type: "SET_COLLAPSED"; payload: boolean };

// Define the initial state
const initialState: AppState = {
  selectedSiderMenu: "dashboard",
  pageLoading: true,
  onlineStatus: true,
  selectedResponsiveMenu: "dashboard",
  collapsed: false,
  lessonCollapsed: false,
  siteConfig: DEFAULT_THEME,
};

// Create the context
const AppContext = createContext<{
  globalState: AppState;
  dispatch: Dispatch<AppAction>;
}>({
  globalState: initialState,
  dispatch: () => undefined,
});

// Create a provider component
export const AppProvider: React.FC<{ children: any }> = ({ children }) => {
  const [globalState, dispatch] = useReducer((currentState: AppState, action: AppAction) => {
    switch (action.type) {
      case "SET_UNREAD_NOTIFICATION":
        return { ...currentState, notifications: action.payload };
      case "SET_USER":
        return { ...currentState, session: action.payload };
      case "SET_SELECTED_SIDER_MENU":
        return { ...currentState, selectedSiderMenu: action.payload };
      case "SET_NAVBAR_MENU":
        return { ...currentState, selectedResponsiveMenu: action.payload };
      case "SET_ONLINE_STATUS":
        return { ...currentState, onlineStatus: action.payload };
      case "SET_LOADER":
        return { ...currentState, pageLoading: action.payload };
      case "SET_COLLAPSED":
        return { ...currentState, collapsed: action.payload };
      case "SET_LESSON_COLLAPSED":
        return { ...currentState, lessonCollapsed: action.payload };
      case "SET_SITE_CONFIG":
        return { ...currentState, siteConfig: action.payload };
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

  return <AppContext.Provider value={{ globalState, dispatch }}>{children}</AppContext.Provider>;
};

// Custom hook to access the context
export const useAppContext = () => useContext(AppContext);
