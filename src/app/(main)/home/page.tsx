import { TweetComposer, Timeline } from '@/features/tweets'
import { MainContentContainer } from '@/shared/components/MainContentContainer'

export default function HomePage() {
  return (
    <MainContentContainer>
      <header className="sticky top-0 z-10 bg-background/70 backdrop-blur-md border-b border-border px-4 py-3">
        <h1 className="text-[15px] font-semibold tracking-tight">Trang chủ</h1>
      </header>
      <TweetComposer />
      <Timeline />
    </MainContentContainer>
  )
}
