import { langs } from "@uiw/codemirror-extensions-langs";
import {
  createContext,
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import { FullQuestion } from "../interfaces/questionService/fullQuestion/object";

export type CodingLanguage = keyof typeof langs;

const defaultQuestion: FullQuestion = {
  id: 1,
  title: "Two Sum",
  difficulty: "Easy",
  content: `
<p>
Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.
You may assume that each input would have exactly one solution, and you may not use the same element twice.
You can return the answer in any order.
</p>
`,
  examples: [
    `<p>Input: nums = [2,7,11,15], target = 9</p>
<p>Output: [0,1]</p>
<p>Explanation: Because nums[0] + nums[1] == 9, we return [0, 1]</p>`,
    `<p>Input: nums = [3,2,4], target = 6</p>
<p>Output: [1,2]</p>`,
    `<p>Input: nums = [3,3], target = 6</p>
<p>Output: [0,1]</p>`,
  ],
  constraints: [
    "2 <= nums.length <= 104",
    "-10^9 <= nums[i] <= 10^9",
    "-10^9 <= target <= 10^9",
    "Only one valid answer exists",
  ],
  createdAt: new Date(),
  updatedAt: new Date(),
  authorId: "abc123",
  initialCodes: [
    {
      code: `class Solution {\npublic int[] twoSum(int[] nums, int target) {\nMap<Integer, Integer> numMap = new HashMap<>();\nint n = nums.length;\nfor (int i = 0; i < n; i++) {\nint complement = target - nums[i];\nif (numMap.containsKey(complement)) {\nreturn new int[]{numMap.get(complement), i};\n}\nnumMap.put(nums[i], i);\n}\nreturn new int[]{}; // No solution found\n}\n}`,
      language: "java",
      questionId: 1,
    },
    {
      code: `class Solution(object):\ndef twoSum(self, nums, target):\n"""\n:type nums: List[int]\n:type target: int\n:rtype: List[int]\n"""\nrequired = {}\nfor i in range(len(nums)):\nif target - nums[i] in required:\nreturn [required[target - nums[i]],i]\nelse:\nrequired[nums[i]]=i\nreturn []`,
      language: "python",
      questionId: 1,
    },
    {
      code: `class Solution {\npublic:\nvector<int> twoSum(vector<int>& nums, int target) {\nmap<int, int> ixs;\nfor(int i = 0; i < nums.size(); i++){\nint complement = target - nums[i];\nif(ixs.find(complement) != ixs.end()){\nreturn vector<int> {i, ixs[complement]};\n}\nixs[nums[i]] = i;\n}\nreturn vector<int> {};\n}\n};`,
      language: "cpp",
      questionId: 1,
    },
  ],
  runnerCodes: [
    {
      code: `import java.util.*;\npublic class Main {\npublic static void main(String[] args) {\nMain main = new Main();\nmain.execute();\n}\nprivate void execute() {\nSolution instance = new Solution();\nScanner scanner = new Scanner(System.in);\nint n = scanner.nextInt();\nint[] numbers = new int[n];\nfor (int i = 0; i < n; i++) {\nnumbers[i] = scanner.nextInt();\n}\nint target = scanner.nextInt();\nscanner.close();\nint[] result = instance.twoSum(numbers, target);\nSystem.out.print(Arrays.toString(result));\n}\n\n@@@INSERT_CODE_HERE@@@\n}`,
      language: "java",
      questionId: 1,
    },
    {
      code: `@@@INSERT_CODE_HERE@@@\ninput_data = input().split()\nn = int(input_data[0])\nnums = list(map(int, input_data[1:n + 1]))\ntarget = int(input_data[n + 1])\nsolution = Solution()\nresult = solution.twoSum(nums, target)\nprint(result)`,
      language: "python",
      questionId: 1,
    },
    {
      code: `#include <iostream>\n#include <vector>\n#include <map>\nusing namespace std;\n\n@@@INSERT_CODE_HERE@@@\n\nint main() {\nint n;\ncin >> n;\nvector<int> nums(n);\nfor (int i = 0; i < n; ++i) {\ncin >> nums[i];\n}\nint target;\ncin >> target;\n\nSolution solution;\nvector<int> result = solution.twoSum(nums, target);\n\ncout << "[";\nfor (int i = 0; i < result.size(); ++i) {\ncout << result[i];\nif (i != result.size() - 1) {\ncout << ",";\n}\n}\ncout << "]" << endl;\n\nreturn 0;\n}`,
      language: "cpp",
      questionId: 1,
    },
  ],
  testCases: [
    {
      testCaseNumber: 1,
      input: "4 2 7 11 15 9",
      expectedOutput: ["[0,1]", "[1,0]"],
      questionId: 1,
    },
    {
      testCaseNumber: 2,
      input: "5 3 2 4 1 9 12",
      expectedOutput: ["[0,4]", "[4,0]"],
      questionId: 1,
    },
    {
      testCaseNumber: 3,
      input: "5 1 9 13 20 47 10",
      expectedOutput: ["[0,1]", "[1,0]"],
      questionId: 1,
    },
    {
      testCaseNumber: 4,
      input: "0 10",
      expectedOutput: ["[]"],
      questionId: 1,
    },
  ],
};

// const mediumQuestion: FullQuestion = {}

const hardQuestion: FullQuestion = {
  id: 3,
  title: "reducing dishes",
  difficulty: "hard",
  content: `
  A chef has collected data on the satisfaction level of his n dishes. Chef can cook any dish in 1 unit of time.

  Like-time coefficient of a dish is defined as the time taken to cook that dish including previous dishes multiplied by its satisfaction level i.e. time[i] * satisfaction[i].

  Return the maximum sum of like-time coefficient that the chef can obtain after preparing some amount of dishes.

  Dishes can be prepared in any order and the chef can discard some dishes to get this maximum value.
`,
  examples: [
    `Input: satisfaction = [-1,-8,0,5,-9]
    Output: 14
    Explanation: After Removing the second and last dish, the maximum total like-time coefficient will be equal to (-1*1 + 0*2 + 5*3 = 14).
    Each dish is prepared in one unit of time.`,
    `Input: satisfaction = [4,3,2]
    Output: 20
    Explanation: Dishes can be prepared in any order, (2*1 + 3*2 + 4*3 = 20)`,
    `Input: satisfaction = [-1,-4,-5]
    Output: 0
    Explanation: People do not like the dishes. No dish is prepared.`,
  ],
  constraints: [
    "n == satisfaction.length",
    "1 <= n <= 500",
    "-1000 <= satisfaction[i] <= 1000",
  ],
  createdAt: new Date(),
  updatedAt: new Date(),
  authorId: "abc123",
  initialCodes: [
    {
      code: `class Solution {public int maxSatisfaction(int[] satisfaction) {}}`,
      language: "java",
      questionId: 1,
    },
    {
      code: `class Solution {public:int maxSatisfaction(vector<int>& satisfaction) {}};`,
      language: "cpp",
      questionId: 1,
    },
  ],
  runnerCodes: [
    {
      code: `import java.util.*;\npublic class Main {\npublic static void main(String[] args) {\nMain main = new Main();\nmain.execute();\n}\nprivate void execute() {\nSolution instance = new Solution();\nScanner scanner = new Scanner(System.in);\nint n = scanner.nextInt();\nint[] numbers = new int[n];\nfor (int i = 0; i < n; i++) {\nnumbers[i] = scanner.nextInt();\n}\nint target = scanner.nextInt();\nscanner.close();\nint[] result = instance.twoSum(numbers, target);\nSystem.out.print(Arrays.toString(result));\n}\n\n@@@INSERT_CODE_HERE@@@\n}`,
      language: "java",
      questionId: 1,
    },
    {
      code: `#include <iostream>\n#include <vector>\n#include <map>\nusing namespace std;\n\n@@@INSERT_CODE_HERE@@@\n\nint main() {\nint n;\ncin >> n;\nvector<int> nums(n);\nfor (int i = 0; i < n; ++i) {\ncin >> nums[i];\n}\nint target;\ncin >> target;\n\nSolution solution;\nvector<int> result = solution.twoSum(nums, target);\n\ncout << "[";\nfor (int i = 0; i < result.size(); ++i) {\ncout << result[i];\nif (i != result.size() - 1) {\ncout << ",";\n}\n}\ncout << "]" << endl;\n\nreturn 0;\n}`,
      language: "cpp",
      questionId: 1,
    },
  ],
  testCases: [
    {
      testCaseNumber: 1,
      input: "5 -1 -8 0 5 -9",
      expectedOutput: ["14"],
      questionId: 1,
    },
    {
      testCaseNumber: 2,
      input: "3 4 3 2",
      expectedOutput: ["20"],
      questionId: 1,
    },
    {
      testCaseNumber: 3,
      input: "3 -1 -4 -5",
      expectedOutput: ["0"],
      questionId: 1,
    },
  ],
};

const defaultInitialCode = "// Default Code //";
const defaultSelectedLanguage = "java" as CodingLanguage;

interface QuestionProviderProps {
  children: ReactNode;
}

interface QuestionContextType {
  question: FullQuestion;
  selectedLanguage: CodingLanguage;
  initialCode: string;
  setSelectedLanguage: (selectedLanguage: CodingLanguage) => void;
  setQuestionId: (id: number) => void;
}

export const QuestionContext = createContext<QuestionContextType>({
  question: defaultQuestion,
  selectedLanguage: defaultSelectedLanguage,
  initialCode: defaultInitialCode,
  setSelectedLanguage: (selectedLanguage: CodingLanguage) => {},
  setQuestionId: (id: number) => {},
});

export function QuestionProvider({ children }: QuestionProviderProps) {
  const [question, setQuestion] = useState<FullQuestion>(defaultQuestion);
  const [selectedLanguage, setSelectedLanguage] = useState<CodingLanguage>(
    defaultSelectedLanguage,
  );
  const [initialCode, setInitialCode] = useState<string>(defaultInitialCode);
  const [questionId, setQuestionId] = useState<number>();

  const value = useMemo(
    () => ({
      question,
      selectedLanguage,
      initialCode,
      setSelectedLanguage,
      setQuestionId,
    }),
    [
      question,
      selectedLanguage,
      initialCode,
      setSelectedLanguage,
      setQuestionId,
    ],
  );

  //   const loadQuestionData = useCallback(() => {
  //     if (!questionId) return;
  //     const questionController = new QuestionController();
  //     questionController
  //       .getQuestion(questionId)
  //       .then((res) => {
  //         if (res) {
  //           setQuestion(res.data);
  //         }
  //       })
  //       .catch((err) => {});
  //   }, [questionId]);

  //   useEffect(() => {
  //     loadQuestionData();
  //   }, [loadQuestionData]);

  const loadInitialCode = useCallback(async () => {
    if (!question) return;
    const foundCode = question.initialCodes.find(
      (x) => x.language === selectedLanguage,
    );
    setInitialCode(foundCode ? foundCode.code : defaultInitialCode);
  }, [question, selectedLanguage]);

  useEffect(() => {
    loadInitialCode();
  }, [loadInitialCode]);

  return (
    <QuestionContext.Provider value={value}>
      {children}
    </QuestionContext.Provider>
  );
}
