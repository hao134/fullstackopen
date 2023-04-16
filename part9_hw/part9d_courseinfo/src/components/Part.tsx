import { CoursePart } from "../types";

const assertNever = (value: never): never => {
  throw new Error(
    `Unhandled discriminated union number: ${JSON.stringify(value)}`
  );
};

const Part = ({ part }: { part: CoursePart }) => {
  switch (part.kind) {
    case "basic":
      return (
        <div>
          <i>{part.description}</i>
        </div>
      );
    case "group":
      return <div>Project exercises {part.groupProjectCount}</div>;
    case "background":
      return (
        <div>
          <div>
            <i>{part.description}</i>
          </div>
          <div><strong>Submit to </strong>{part.backgroundMaterial}</div>
        </div> 
      );
    case "special":
      return (
        <div>
            <div><i>{part.description}</i></div>
            <div>required skills: {part.requirements.join(', ')}</div>
        </div>
      )
    default:
      return assertNever(part);
  }
};

export default Part;