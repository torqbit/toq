import { WordRotate } from "./Animations/WordRotate";

const AiLoader: React.FC<{ showWordRotate: boolean; wordRotateMessages: string[]; minHeight: string }> = ({
  showWordRotate,
  minHeight,
  wordRotateMessages,
}) => {
  return (
    <>
      {showWordRotate && <WordRotate className="z-30" words={wordRotateMessages} rotationTime={4000} duration={4000} />}
    </>
  );
};

export default AiLoader;
