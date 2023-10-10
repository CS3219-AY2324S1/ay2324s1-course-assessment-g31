interface ICodeResultProps {
  result: string;
}

function CodeResult({ result }: ICodeResultProps) {
  return (
    <div className="h-80 border rounded-lg shadow p-5">
      <h1 className="font-bold text-gray-900">Code Result</h1>
      <p>{result}</p>
    </div>
  );
}

export default CodeResult;
