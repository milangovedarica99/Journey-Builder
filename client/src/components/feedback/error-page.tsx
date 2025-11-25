interface ErrorPageProps {
  title?: string;
  description?: string;
}

const ErrorPage = ({
  title = 'Something went wrong',
  description = 'Please try again or go back.',
}: ErrorPageProps) => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-gray-50">
      <div className="rounded-lg border border-gray-200 bg-white px-6 py-5 shadow-sm">
        <div className="text-lg font-semibold">{title}</div>
        <div className="mt-2 max-w-md text-sm text-gray-600">{description}</div>
      </div>
    </div>
  );
};

export default ErrorPage;
