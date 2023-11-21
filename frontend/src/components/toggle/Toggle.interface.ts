export default interface ToggleProps {
  currentState: boolean;
  leftComponent: React.ReactNode;
  rightComponent: React.ReactNode;
  setState: (newState: boolean) => void;
}
