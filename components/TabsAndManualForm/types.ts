export type TabsAndManualFormTab = {
  value: number;
  title: string;
};

export type TabsAndManualFormProps = {
  tabs: TabsAndManualFormTab[];
  value: number | undefined;
  maxValue: number;
  disabled?: boolean;
  onChange?: (value: number) => void;
  tabInnerClassName?: string;
  onValidityChange?: (isValid: boolean) => void;
  manualTabText: string;
}