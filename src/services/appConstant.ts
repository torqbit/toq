export default {
  noOfFreeTrialDays: 14,
  // countryPhoneCode: [
  //   { flagUrl: "https://flagcdn.com/w40/in.png", code: "+91" }, // India
  //   { flagUrl: "https://flagcdn.com/w40/us.png", code: "+1" }, // United States
  //   { flagUrl: "https://flagcdn.com/w40/gb.png", code: "+44" }, // United Kingdom
  //   { flagUrl: "https://flagcdn.com/w40/ae.png", code: "+971" }, // United Arab Emirates
  //   { flagUrl: "https://flagcdn.com/w40/sa.png", code: "+966" }, // Saudi Arabia
  //   { flagUrl: "https://flagcdn.com/w40/qa.png", code: "+974" }, // Qatar
  //   { flagUrl: "https://flagcdn.com/w40/kw.png", code: "+965" }, // Kuwait
  //   { flagUrl: "https://flagcdn.com/w40/om.png", code: "+968" }, // Oman
  //   { flagUrl: "https://flagcdn.com/w40/bh.png", code: "+973" }, // Bahrain
  //   { flagUrl: "https://flagcdn.com/w40/tr.png", code: "+90" }, // Turkey
  //   { flagUrl: "https://flagcdn.com/w40/pk.png", code: "+92" }, // Pakistan
  //   { flagUrl: "https://flagcdn.com/w40/bd.png", code: "+880" }, // Bangladesh
  //   { flagUrl: "https://flagcdn.com/w40/np.png", code: "+977" }, // Nepal
  //   { flagUrl: "https://flagcdn.com/w40/lk.png", code: "+94" }, // Sri Lanka
  //   { flagUrl: "https://flagcdn.com/w40/ir.png", code: "+98" }, // Iran
  //   { flagUrl: "https://flagcdn.com/w40/id.png", code: "+62" }, // Indonesia
  //   { flagUrl: "https://flagcdn.com/w40/my.png", code: "+60" }, // Malaysia
  //   { flagUrl: "https://flagcdn.com/w40/ph.png", code: "+63" }, // Philippines
  //   { flagUrl: "https://flagcdn.com/w40/th.png", code: "+66" }, // Thailand
  //   { flagUrl: "https://flagcdn.com/w40/vn.png", code: "+84" }, // Vietnam
  //   { flagUrl: "https://flagcdn.com/w40/cn.png", code: "+86" }, // China
  //   { flagUrl: "https://flagcdn.com/w40/jp.png", code: "+81" }, // Japan
  //   { flagUrl: "https://flagcdn.com/w40/kr.png", code: "+82" }, // South Korea
  //   { flagUrl: "https://flagcdn.com/w40/sg.png", code: "+65" }, // Singapore
  //   { flagUrl: "https://flagcdn.com/w40/il.png", code: "+972" }, // Israel
  //   { flagUrl: "https://flagcdn.com/w40/au.png", code: "+61" }, // Australia
  //   { flagUrl: "https://flagcdn.com/w40/ru.png", code: "+7" }, // Russia
  //   { flagUrl: "https://flagcdn.com/w40/ca.png", code: "+1" }, // Canada
  // ],
  countryPhoneCode: [
    { flag: "🇮🇳", code: "+91" }, // India
    { flag: "🇺🇸", code: "+1" }, // United States
    { flag: "🇬🇧", code: "+44" }, // United Kingdom
    { flag: "🇦🇪", code: "+971" }, // United Arab Emirates
    { flag: "🇸🇦", code: "+966" }, // Saudi Arabia
    { flag: "🇶🇦", code: "+974" }, // Qatar
    { flag: "🇰🇼", code: "+965" }, // Kuwait
  ],
  months: [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ],
  availableModels: ["gpt-4o-mini", "gpt-4.1-mini"],
  targetAudience: ["Developers", "Marketers", "Admins", "Partners", "Analysts"],
  academyCategory: ["Marketing Automation", "CRM", "DevOps", "CI/CD"],
  websiteUrl: "https://torqbit.com",
  cmnErrorMsg: "Something went wrong. Please try again later",
  platformName: "Toq",
  subDomain: "torq.local:3000",
  ignoredIP: ["127.0.0.1", "198.168.1.1", "localhost:3000"],
  platformLogo: `https://cdn.torqbit.com/static/brand/logo.png`,
  platformIcon: `https://cdn.torqbit.com/static/brand/brand-icon.png`,
  defaultAgentTemperature: 0.1,
  defaultAgentPrompt: `
  You are a smart, friendly, and professional virtual assistant for a SaaS platform. Your role is to guide users through the product, help them complete tasks, understand features, troubleshoot issues, and make the most of the platform. You must respond clearly and concisely, avoiding technical jargon unless the user is experienced. Provide step-by-step instructions when needed, and always ask clarifying questions if the user’s request is unclear or missing context.

  You understand the full scope of the SaaS product, including its features, pricing plans, onboarding steps, integrations, and limitations. You tailor your responses based on the user's experience level and goals—offering quick tips for power users and in-depth help for beginners.

  Maintain a helpful and positive tone, like a supportive team member. When a task isn’t possible or requires external services, explain why and offer alternatives if possible. Always prioritize user success and clear outcomes.
  
  `,
  videoTranscribeDuration: 45,
  TextToTextModel: "gpt-4.1-mini",
  documentExtensions: [
    { value: "pdf", label: "PDF" },
    { value: "docx", label: "Word" },
    { value: "xlsx", label: "Excel" },
    { value: "zip", label: "Archive" },
  ],
  authorizedUrls: [
    "/blogs",
    "/dashboard",
    "/login",
    "/signup",
    "/academy",
    "/",
    "/updates",
    "/events",
    "/admin",
    "/settings",
    "/home",
    "/about",
    "/contact",
    "/academy",
    "/changelog",
    "/terms-conditions",
    "/events",
    "/workshops",
  ],
  projectFramework: [
    {
      label: "Static Web",
      value: "STATIC_WEB",
    },
    {
      label: "ReactJS",
      value: "REACTJS",
    },
    {
      label: "Next App",
      value: "NEXT_APP",
    },
  ],
  submissionTypes: [
    {
      label: "Programming Language",
      value: "PROGRAMMING_LANG",
    },
    {
      label: "Programming Project",
      value: "PROGRAMMING_PROJECT",
    },
    {
      label: "Text",
      value: "TEXT",
    },
    {
      label: "URL",
      value: "URL",
    },
    {
      label: "File",
      value: "FILE",
    },
  ],
  programmingLanguages: [
    { key: "javascript", value: "JavaScript" },
    { key: "python", value: "Python" },
    { key: "java", value: "Java" },
    { key: "cpp", value: "C++" },
    { key: "csharp", value: "C#" },
    { key: "ruby", value: "Ruby" },
    { key: "php", value: "PHP" },
    { key: "swift", value: "Swift" },
    { key: "kotlin", value: "Kotlin" },
    { key: "go", value: "Go" },
    { key: "rust", value: "Rust" },
    { key: "typescript", value: "TypeScript" },
    { key: "dart", value: "Dart" },
    { key: "scala", value: "Scala" },
    { key: "perl", value: "Perl" },
    { key: "haskell", value: "Haskell" },
    { key: "lua", value: "Lua" },
    { key: "shell", value: "Shell" },
    { key: "r", value: "R" },
    { key: "matlab", value: "MATLAB" },
    { key: "objective_c", value: "Objective-C" },
    { key: "assembly", value: "Assembly" },
    { key: "visual_basic", value: "Visual Basic" },
    { key: "fsharp", value: "F#" },
    { key: "elixir", value: "Elixir" },
    { key: "clojure", value: "Clojure" },
    { key: "erlang", value: "Erlang" },
    { key: "groovy", value: "Groovy" },
    { key: "fortran", value: "Fortran" },
    { key: "ada", value: "Ada" },
    { key: "cobol", value: "COBOL" },
    { key: "crystal", value: "Crystal" },
    { key: "scheme", value: "Scheme" },
    { key: "prolog", value: "Prolog" },
    { key: "sql", value: "SQL" },
  ],

  defaultPageSize: 5,
  address: "Your address",
  state: "Your state",
  country: "Your country",
  homeDirName: ".torqbit",
  staticFileDirName: "static",
  defaultCMSProvider: "bunny.net",
  defaultCMSReplicatedRegions: ["SYD", "SG"],
  defaultMainStorageRegion: "DE",
  defaultVideoResolutions: ["360p", "480p", "720p"],
  attachmentFileFolder: "discussion-attachment",
  supportEmail: "support@acme.com",
  convertMiliSecondsToMinutes: 60 * 1000,
  mediaTempDir: "media",
  invoiceTempDir: "invoices",
  currency: "INR",

  contacts: [
    {
      title: "Legal Entity",
      description: "Toq",
    },
    {
      title: "Registered Address",
      description: "",
    },
    {
      title: "Operational Address",
      description: "",
    },
    {
      title: "Telephone No",
      description: "",
    },
    {
      title: "E-Mail ID",
      description: "support@acme.com",
    },
  ],
  payment: {
    currency: "INR",
    lockoutMinutes: 30 * 1000,
    sessionExpiryDuration: 24 * 60 * 60 * 1000,
    cashfree: {
      paymentMethods: "upi, nb, cc, dc,app",
    },

    taxRate: 18,
  },

  fontDirectory: {
    dmSerif: {
      italic: "/public/fonts/DM_Serif_Display/DMSerifDisplay-Italic.ttf",
      regular: "/public/fonts/DM_Serif_Display/DMSerifDisplay-Regular.ttf",
    },
    kaushan: "/public/fonts/KaushanScript-Regular.ttf",
    kalam: "/public/fonts/Kalam-Regular.ttf",
  },
  userRole: {
    STUDENT: "STUDENT",
    AUTHOR: "AUTHOR",
    TA: "TA",
  },
  development: {
    cookieName: "next-auth.session-token",
  },
  production: {
    cookieName: "__Secure-next-auth.session-token",
  },
  lineChart: {
    graphColor: "#5b63d3",
    black: "#000",
    white: "#fff",
    grey: "#eee",
  },

  mimeType: {
    xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    xls: "application/vnd.ms-excel",
    csv: "text/csv",
    pdf: "application/pdf",
    txt: "text/plain",
    jpg: "image/jpeg",
    png: "image/png",
    gif: "image/gif",
  } as any,
};
