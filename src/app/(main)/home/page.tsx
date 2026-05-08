import { TweetComposer, Timeline } from '@/features/tweets'

export default function HomePage() {
  return (
    <div>
      <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm border-b px-4 py-3">
        <h1 className="font-bold text-xl">Trang chủ</h1>
      </div>
      <TweetComposer />
      <Timeline />
    </div>
  )
}
