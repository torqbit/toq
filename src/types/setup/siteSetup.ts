export interface ISiteSetupCard {
  icon: string;
  title: string;
  description: string;
  link: string;
  iconBgColor?: string;
}

export interface ITenantOnboardStatus {
  onBoarded: boolean;

  aiAssistant: boolean;
}
