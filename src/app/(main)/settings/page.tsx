'use client'

import { ArrowLeft, UserCog, KeyRound } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { EditProfileForm, ChangePasswordForm } from '@/features/users'
import { MainContentContainer } from '@/shared/components/MainContentContainer'

export default function SettingsPage() {
  const router = useRouter()

  return (
    <MainContentContainer>
      <header className="sticky top-0 z-10 bg-background/70 backdrop-blur-md border-b border-border px-4 py-3 flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          className="size-8"
          aria-label="Quay lại"
          onClick={() => router.back()}
        >
          <ArrowLeft className="size-4" />
        </Button>
        <div>
          <h1 className="text-[15px] font-semibold tracking-tight">Cài đặt</h1>
          <p className="text-xs text-muted-foreground">Quản lý hồ sơ và bảo mật</p>
        </div>
      </header>

      <Tabs defaultValue="profile" className="p-4 space-y-4">
        <TabsList>
          <TabsTrigger value="profile">
            <UserCog className="size-4" aria-hidden />
            Hồ sơ
          </TabsTrigger>
          <TabsTrigger value="password">
            <KeyRound className="size-4" aria-hidden />
            Mật khẩu
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-1">
          <h2 className="text-sm font-semibold">Chỉnh sửa hồ sơ</h2>
          <p className="text-xs text-muted-foreground mb-4">
            Thông tin hiển thị công khai trên trang cá nhân.
          </p>
          <EditProfileForm />
        </TabsContent>

        <TabsContent value="password" className="space-y-1">
          <h2 className="text-sm font-semibold">Đổi mật khẩu</h2>
          <p className="text-xs text-muted-foreground mb-4">
            Sau khi đổi, các session khác vẫn còn refresh token — đăng xuất từ các thiết bị
            đó nếu cần.
          </p>
          <ChangePasswordForm />
        </TabsContent>
      </Tabs>
    </MainContentContainer>
  )
}
