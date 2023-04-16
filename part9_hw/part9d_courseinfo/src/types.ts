interface CoursePartBase {
    name: string;
    exerciseCount: number;
}

interface CoursePartBasic extends CoursePartBase{
    description: string;
    kind: "basic"
}

interface GroupPartGroup extends CoursePartBase{
    groupProjectCount: number;
    kind: "group"
}

interface CoursePartBackground extends CoursePartBase{
    description: string;
    backgroundMaterial: string;
    kind: "background"
}

interface CoursePartSpecial extends CoursePartBase{
    description: string;
    requirements: string[];
    kind: "special"
}

export type CoursePart =
  | CoursePartBasic
  | GroupPartGroup
  | CoursePartBackground
  | CoursePartSpecial;