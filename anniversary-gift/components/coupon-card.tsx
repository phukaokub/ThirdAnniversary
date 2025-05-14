"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Mail, Lock } from "lucide-react"

interface CouponCardProps {
  coupon: {
    id: number
    title: string
    description: string
    icon: string
    isLocked?: boolean
    usageLimit?: number
  }
  isUsed: boolean
  usageCount?: number
  onUse: () => void
  canUseLockedCoupon?: boolean
}

export function CouponCard({ coupon, isUsed, usageCount = 0, onUse, canUseLockedCoupon = false }: CouponCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ scale: isUsed ? 1 : 1.03, y: isUsed ? 0 : -5 }}
      className={isUsed ? "opacity-70" : ""}
    >
      <Card
        className={`overflow-hidden border-0 ${isUsed ? "bg-gray-100" : "bg-white"} shadow-xl relative letter-card`}
      >
        {/* Envelope flap */}
        <div className="absolute top-0 left-0 w-full h-12 bg-rose-100 z-0">
          <div className="absolute bottom-0 left-0 w-0 h-0 border-l-[150px] border-r-[150px] border-t-[20px] border-l-transparent border-r-transparent border-t-rose-100 transform translate-y-full"></div>
        </div>

        {/* Status badges */}
        {isUsed && (
          <div className="absolute -top-1 -right-1 z-10">
            <div className="bg-gray-500/90 backdrop-blur-sm text-white text-xs font-medium px-3 py-1 rounded-bl-lg rounded-tr-lg shadow-md">
              ใช้ไปแล้ว
            </div>
          </div>
        )}

        {coupon.usageLimit && usageCount > 0 && !isUsed && (
          <div className="absolute -top-1 -right-1 z-10">
            <Badge
              variant="secondary"
              className="bg-white/90 backdrop-blur-sm text-gray-700 hover:bg-white/90 shadow-md px-3 py-1 rounded-bl-lg rounded-tr-lg"
            >
              ใช้ไปแล้ว {usageCount}/{coupon.usageLimit} ครั้ง
            </Badge>
          </div>
        )}

        <CardHeader className="relative pb-2 pt-8 z-10">
          <div className="flex justify-center mb-2">
            <div className="w-16 h-16 rounded-full bg-rose-50 border-2 border-rose-200 flex items-center justify-center text-4xl shadow-inner">
              {coupon.icon}
            </div>
          </div>
          <CardTitle className="text-center text-2xl font-bold text-gray-800">{coupon.title}</CardTitle>
        </CardHeader>

        <CardContent className="relative pt-4 pb-2 z-10">
          <div className="border-t border-dashed border-rose-200 pt-4 mx-4">
            <p className="text-center text-gray-600 font-medium">{coupon.description}</p>
          </div>
        </CardContent>

        <CardFooter className="relative flex justify-center pb-6 pt-2 z-10">
          <Button
            onClick={onUse}
            disabled={isUsed || (coupon.isLocked && !canUseLockedCoupon)}
            variant={isUsed ? "outline" : "default"}
            className={`
              rounded-full px-6 shadow-lg transition-all duration-300 gap-2
              ${
                isUsed
                  ? "bg-gray-100 text-gray-400 border-gray-200"
                  : coupon.isLocked && !canUseLockedCoupon
                    ? "bg-gray-100 text-gray-400"
                    : "bg-rose-500 hover:bg-rose-600 text-white border-0"
              }
            `}
          >
            {isUsed ? (
              "ใช้ไปแล้ว"
            ) : coupon.isLocked && !canUseLockedCoupon ? (
              <>
                <Lock size={16} />
                ยังใช้ไม่ได้
              </>
            ) : (
              <>
                <Mail size={16} />
                ใช้คูปอง
              </>
            )}
          </Button>
        </CardFooter>

        {/* Envelope seal */}
        {/* <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 w-10 h-10 rounded-full bg-rose-500 z-20 flex items-center justify-center text-white">
          <Mail size={18} />
        </div> */}

        {/* Locked overlay */}
        {coupon.isLocked && !canUseLockedCoupon && (
          <div className="absolute inset-0 bg-gray-100/80 backdrop-blur-sm flex items-center justify-center z-30">
            <div className="bg-white rounded-lg p-4 shadow-lg flex flex-col items-center">
              <Lock className="text-gray-500 mb-2" size={32} />
              <p className="text-center text-gray-700 font-medium">ใช้คูปองอื่นให้หมดก่อน</p>
            </div>
          </div>
        )}
      </Card>
    </motion.div>
  )
}
