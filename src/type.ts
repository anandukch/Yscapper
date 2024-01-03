type Results = {
  "0-100": any[];
  "101-200": any[];
  "201-300": any[];
  "301-n": any[];
};

type DataPropsType = RegExpMatchArray | null | string[];

type DataType = {
  rank: DataPropsType;
  title: DataPropsType;
  points: DataPropsType;
  author: DataPropsType;
  comments: DataPropsType;
};
