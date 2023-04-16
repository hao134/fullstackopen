import { CoursePart } from "../types"
import Part from "./Part"

const Content = ({ parts }: { parts: CoursePart[] }) => {
    return (
      <div>
        {parts.map((part, idx) => (
          <div key={idx}>
            <div>
              <strong>
                {part.name} {part.exerciseCount}
              </strong>
            </div>
            <Part part={part} />
          </div>
        ))}
      </div>
    )
}

export default Content