"use client"

import { useState, useEffect } from "react"
import { Heart } from 'lucide-react'
import { CouponCard } from "@/components/coupon-card"
import { ConfirmationModal } from "@/components/confirmation-modal"
import { sendCouponUsageEmail, getCouponUsage, updateCouponUsage } from "@/app/actions"
import { toast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"

// Sample coupon data
const coupons = [
  {
    id: 1,
    title: "ค่าช้อปปิ้ง 2,000 บาท",
    description: "ใช้ได้ภายในวันที่ 1 July - 31 Dec 2025",
    icon: "🛍️",
  },
  {
    id: 2,
    title: "ฟรีค่าที่พักทริปค้างคืน",
    description: "ฟรีค่าที่พักทริปค้างคืน 1 คืน",
    icon: "🏨",
  },
  {
    id: 3,
    title: "ยอมแล้ววว",
    description: "ยอมอะไรก็ได้ 1 รอบ (ใช้ได้ 5 ครั้ง)",
    icon: "🙏",
    usageLimit: 5,
  },
  {
    id: 4,
    title: "ความลับสุดยอดดดด",
    description: "จะใช้ได้ก็ต่อเมื่อใช้คูปองอื่นๆครบแล้วเท่านั้น",
    icon: "🎁",
    isLocked: true,
  },
]

export default function LandingPage() {
  const [usedCoupons, setUsedCoupons] = useState<number[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedCoupon, setSelectedCoupon] = useState<(typeof coupons)[0] | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // Add tracking for coupon usage count
  const [couponUsageCounts, setCouponUsageCounts] = useState<Record<number, number>>({})

  // Load coupon usage from database on mount
  useEffect(() => {
    async function loadCouponUsage() {
      const { usedCoupons: dbUsedCoupons, couponUsageCounts: dbCouponUsageCounts } = await getCouponUsage()
      setUsedCoupons(dbUsedCoupons)
      setCouponUsageCounts(dbCouponUsageCounts)
      setIsLoading(false)
    }
    
    loadCouponUsage()
  }, [])

  const handleUseCoupon = (coupon: (typeof coupons)[0]) => {
    setSelectedCoupon(coupon)
    setIsModalOpen(true)
  }

// Update the confirmUseCoupon function to handle usage limits and save to database
  const confirmUseCoupon = async () => {
    if (selectedCoupon && !isSubmitting) {
      setIsSubmitting(true)

      // Calculate new usage count
      const currentCount = couponUsageCounts[selectedCoupon.id] || 0
      const newCount = currentCount + 1

      // Check if coupon will be fully used
      const fullyUsed = !selectedCoupon.usageLimit || newCount >= (selectedCoupon.usageLimit || 1)
      
      // Update database
      await updateCouponUsage(selectedCoupon.id, newCount, fullyUsed)

      // Update local state
      setCouponUsageCounts({
        ...couponUsageCounts,
        [selectedCoupon.id]: newCount,
      })
      
      // Mark as used if limit reached
      if (fullyUsed) {
        setUsedCoupons([...usedCoupons, selectedCoupon.id])
      }

      // Send email notification
      try {
        const result = await sendCouponUsageEmail(selectedCoupon, newCount)

        if (result.success) {
          toast({
            title: "ส่งอีเมลแจ้งเตือนแล้ว",
            description: "อีเมลแจ้งเตือนการใช้คูปองถูกส่งเรียบร้อยแล้ว",
          })
        } else {
          toast({
            title: "ไม่สามารถส่งอีเมลได้",
            description: "เกิดข้อผิดพลาดในการส่งอีเมลแจ้งเตือน แต่คูปองถูกใช้งานเรียบร้อยแล้ว",
            variant: "destructive",
          })
        }
      } catch (error) {
        console.error("Error sending email:", error)
        toast({
          title: "เกิดข้อผิดพลาด",
          description: "ไม่สามารถส่งอีเมลแจ้งเตือนได้ แต่คูปองถูกใช้งานเรียบร้อยแล้ว",
          variant: "destructive",
        })
      }

      setIsModalOpen(false)
      setIsSubmitting(false)
    }
  }

// Check if all other coupons are used to enable the locked coupon
  const allOtherCouponsUsed = coupons
    .filter((c) => !c.isLocked)
    .every((c) => {
      if (c.usageLimit) {
        return (couponUsageCounts[c.id] || 0) >= (c.usageLimit || 1)
      }
      return usedCoupons.includes(c.id)
    })

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-10 w-10 border-4 border-rose-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-rose-600">กำลังโหลด...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50">
      <div className="absolute inset-0 bg-[url('/placeholder.svg?key=ijndv')] opacity-5 bg-cover bg-center mix-blend-soft-light pointer-events-none"></div>

      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-r from-pink-200/20 via-purple-200/20 to-blue-200/20 blur-3xl transform -translate-y-1/2 rounded-full"></div>
      <div className="absolute bottom-0 right-0 w-full h-64 bg-gradient-to-r from-rose-200/20 via-pink-200/20 to-purple-200/20 blur-3xl transform translate-y-1/2 rounded-full"></div>

      <div className="relative z-10">
        {/* Header */}
        <header className="pt-24 pb-16 text-center px-4">
          <div className="inline-flex justify-center items-center mb-6 p-4 bg-white/30 backdrop-blur-sm rounded-full shadow-xl">
            <Heart className="h-12 w-12 text-rose-500 animate-pulse" />
          </div>
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-rose-600 via-pink-600 to-purple-600 text-transparent bg-clip-text mb-4 tracking-tight">
            สุขสันต์วันครบรอบ 3 ของเราค้าบที่รักกก
          </h1>
            <p className="text-xl text-gray-700 max-w-md mx-auto font-light leading-relaxed text-center">
            ของขวัญพิเศษสำหรับเพอๆที่น่ารักของเค้า<br />
            มีคูปองให้ 4 ใบดั๊ว เพอๆจะใช้เมื่อไหร่ก็ได้น้าคั้บ
            </p>
        </header>

        {/* Coupons Section */}
        <section className="max-w-6xl mx-auto px-4 py-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {coupons.map((coupon) => (
              <CouponCard
                key={coupon.id}
                coupon={coupon}
                isUsed={
                  coupon.usageLimit
                    ? (couponUsageCounts[coupon.id] || 0) >= (coupon.usageLimit || 1)
                    : usedCoupons.includes(coupon.id)
                }
                usageCount={couponUsageCounts[coupon.id] || 0}
                onUse={() => handleUseCoupon(coupon)}
                canUseLockedCoupon={allOtherCouponsUsed}
              />
            ))}
          </div>
        </section>

        {/* Footer */}
        <footer className="py-12 text-center">
          <div className="inline-block px-6 py-2 bg-white/30 backdrop-blur-sm rounded-full shadow-sm">
            <p className="text-gray-700">ทำด้วยความรักและ ดาเมะ ดาเมะๆ ❤️ สำหรับวันพิเศษของพวกเรา</p>
          </div>
        </footer>
      </div>

      {/* Confirmation Modal */}
      {selectedCoupon && (
        <ConfirmationModal
          isOpen={isModalOpen}
          coupon={selectedCoupon}
          onClose={() => setIsModalOpen(false)}
          onConfirm={confirmUseCoupon}
          isSubmitting={isSubmitting}
        />
      )}

      <Toaster />
    </div>
  )
}
