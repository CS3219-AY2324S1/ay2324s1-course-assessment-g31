import MDEditor from "@uiw/react-md-editor";
import { useState } from "react";

function QuestionUpdatePage() {
  const [value, setValue] = useState<string | undefined>("Initial value");

  return (
    <div className="p-10">
      <h1 className="text-dark dark:text-gray-100">Question Update Page</h1>
      <h1 className="text-dark dark:text-gray-100">Question Prompt</h1>
      <div className="my-5">
        <MDEditor value={value} onChange={setValue} minHeight={400} />
      </div>
      <div className="my-5">
        <MDEditor.Markdown
          source={value}
          style={{ whiteSpace: "pre-wrap", padding: "10px" }}
        />
      </div>
    </div>
  );
}

export default QuestionUpdatePage;
