import { CodingLanguage } from "../../context/QuestionContext";
import GenericController, {
  ControllerParamsHeaders,
} from "../generic.controller";

const url = "https://judge0-ce.p.rapidapi.com";
const headers = {
  "X-RapidAPI-Key": "89813d6d5fmsh27bf42e8a3eab33p134acdjsne03c01e99817",
  "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
};

export type SubmissionTokenDTO = {
  token: string;
};

export type CodeInput = {
  source_code: string;
  stdin?: string;
  expected_output?: string;
};

type SubmissionCreateDTO = {
  language_id: number;
} & CodeInput;

type BatchSubmissionCreateDTO = {
  submissions: SubmissionCreateDTO[];
};

export type SubmissionParams = {
  wait: boolean;
  base64_encoded: boolean;
};

export type Submission = {
  source_code: string;
  language_id: number;
  stdin: string;
  expected_output: string;
  stdout: string;
  status_id: number;
  created_at: string;
  finished_at: string;
  time: string;
  memory: number;
  stderr: unknown;
  token: string;
  number_of_runs: number;
  cpu_time_limit: string;
  cpu_extra_time: string;
  wall_time_limit: string;
  memory_limit: number;
  stack_limit: number;
  max_processes_and_or_threads: number;
  enable_per_process_and_thread_time_limit: boolean;
  enable_per_process_and_thread_memory_limit: boolean;
  max_file_size: number;
  compile_output: unknown;
  exit_code: number;
  exit_signal: unknown;
  message: unknown;
  wall_time: string;
  compiler_options: unknown;
  command_line_arguments: unknown;
  redirect_stderr_to_stdout: boolean;
  callback_url: unknown;
  additional_files: unknown;
  enable_network: boolean;
  status: {
    id: number;
    description: string;
  };
  language: {
    id: number;
    name: string;
  };
};

type BatchSubmission = {
  submissions: Submission[];
};

export default class Judge0Controller extends GenericController {
  private judge0LanguageMap: Map<CodingLanguage, number>;

  constructor() {
    super(url);
    this.judge0LanguageMap = new Map<CodingLanguage, number>([
      ["java", 91],
      ["cpp", 54],
      ["python", 92],
    ]);
  }

  public about() {
    return this.get("about", { headers });
  }

  public getSubmission(token: string) {
    return this.get<Submission>(`submissions/${token}`, { headers });
  }

  public getBatchSubmission(tokens: string[]) {
    return this.get<BatchSubmission>("submissions/batch", {
      params: {
        tokens: tokens.join(","),
        base64_encoded: "true",
      },
      headers,
    });
  }

  public getLanguage(languageCode: number) {
    return this.get(`languages/${languageCode}`, { headers });
  }

  public getLanguages() {
    return this.get("languages", { headers });
  }

  public getStatuses() {
    return this.get("statuses", { headers });
  }

  public getConfiguration() {
    return this.get("config_info", { headers });
  }

  public postSubmission(
    languageCode: CodingLanguage,
    codeInput: CodeInput,
    params: SubmissionParams,
  ) {
    const data: SubmissionCreateDTO = {
      language_id: this.judge0LanguageMap.get(languageCode)!,
      ...codeInput,
    };
    const paramsHeaders: ControllerParamsHeaders = {
      params,
      headers,
    };
    return this.post<SubmissionTokenDTO, SubmissionCreateDTO>(
      "submissions",
      data,
      paramsHeaders,
    );
  }

  public postBatchSubmission(
    languageCode: CodingLanguage,
    codeInputs: CodeInput[],
    params: SubmissionParams,
  ) {
    const data: BatchSubmissionCreateDTO = {
      submissions: codeInputs.map((x) => ({
        language_id: this.judge0LanguageMap.get(languageCode)!,
        ...x,
      })),
    };
    const paramsHeaders: ControllerParamsHeaders = {
      params,
      headers,
    };
    return this.post<SubmissionTokenDTO[], BatchSubmissionCreateDTO>(
      "submissions/batch",
      data,
      paramsHeaders,
    );
  }
}
