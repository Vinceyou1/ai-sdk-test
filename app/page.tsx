export default function Home() {
  return (
    <div className="flex-grow flex flex-col items-center justify-center">
      <div>
        <h1 className="text-2xl font-semibold">
          Welcome to my AI SDK Test App
        </h1>
        <p className="mt-4">
          This is a simple application to test the AI SDK integration.
        </p>
        <p>If you're running this locally, make sure to obtain an API key for Google Gemini.</p>
      </div>
    </div>
  );
}
