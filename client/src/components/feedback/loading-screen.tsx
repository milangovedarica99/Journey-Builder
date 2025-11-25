import { LoaderIcon } from '@/assets';

type LoadingScreenProps = {
  message?: string;
};

const LoadingScreen = ({ message = 'Loading...' }: LoadingScreenProps) => {
  return (
    <div
      className="flex min-h-screen items-center justify-center gap-3 text-journey-builder-light-blue"
      data-testid="loading-screen"
    >
      <LoaderIcon className="size-10 animate-spin" />
      <span className="text-base font-medium">{message}</span>
    </div>
  );
};

export default LoadingScreen;
