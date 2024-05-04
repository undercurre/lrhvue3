type Effect = () => void;

type DepsMap = Map<PropertyKey, Set<Effect>>;
