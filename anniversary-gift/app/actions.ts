"use server"

import { Resend } from "resend"
import { supabase } from "@/lib/supabase"

// Initialize Resend with your API key
const resend = new Resend(process.env.RESEND_API_KEY || "test_api_key")

interface CouponData {
  id: number
  title: string
  description: string
  icon: string
  usageLimit?: number
  isLocked?: boolean
}

export async function sendCouponUsageEmail(coupon: CouponData, usageCount?: number) {
  try {
    const data = await resend.emails.send({
      from: "Anniversary Gift <onboarding@resend.dev>",
      to: "teerawat2545@gmail.com",
      subject: `คูปอง "${coupon.title}" ถูกใช้งานแล้ว`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #be123c; text-align: center;">มีการใช้คูปองแล้ว!</h1>
          <div style="background-color: #ffe4e6; border-radius: 8px; padding: 20px; margin: 20px 0;">
            <div style="font-size: 48px; text-align: center; margin-bottom: 10px;">${coupon.icon}</div>
            <h2 style="color: #be123c; text-align: center; margin: 0 0 10px 0;">${coupon.title}</h2>
            <p style="text-align: center; color: #4b5563;">${coupon.description}</p>
            ${
              coupon.usageLimit
                ? `
            <p style="text-align: center; font-weight: bold; color: #be123c;">
              ใช้ไปแล้ว ${usageCount || 1} จาก ${coupon.usageLimit} ครั้ง
            </p>
            `
                : ""
            }
            <p style="text-align: center; color: #4b5563; margin-top: 20px;">
              เวลาที่ใช้: ${new Date().toLocaleString("th-TH")}
            </p>
          </div>
          <p style="text-align: center; color: #9ca3af;">
            อีเมลนี้ถูกส่งโดยอัตโนมัติจากเว็บไซต์ของขวัญครบรอบ 3 ปี
          </p>
        </div>
      `,
    })

    return { success: true, data }
  } catch (error) {
    console.error("Failed to send email:", error)
    return { success: false, error }
  }
}

// New functions to interact with the database

export async function getCouponUsage() {
  const { data, error } = await supabase
    .from('coupon_usage')
    .select('*')
  
  if (error) {
    console.error('Error fetching coupon usage:', error)
    return { usedCoupons: [], couponUsageCounts: {} }
  }
  
  // Transform data into the format expected by the frontend
  const usedCoupons: number[] = []
  const couponUsageCounts: Record<number, number> = {}
  
  data.forEach(item => {
    couponUsageCounts[item.coupon_id] = item.used_count
    if (item.fully_used) {
      usedCoupons.push(item.coupon_id)
    }
  })
  
  return { usedCoupons, couponUsageCounts }
}

export async function updateCouponUsage(
  couponId: number, 
  usageCount: number, 
  fullyUsed: boolean
) {
  // Check if the coupon already exists in the database
  const { data: existingData } = await supabase
    .from('coupon_usage')
    .select('*')
    .eq('coupon_id', couponId)
    .single()
  
  if (existingData) {
    // Update existing record
    const { error } = await supabase
      .from('coupon_usage')
      .update({
        used_count: usageCount,
        fully_used: fullyUsed,
        updated_at: new Date().toISOString()
      })
      .eq('coupon_id', couponId)
      
    if (error) {
      console.error('Error updating coupon usage:', error)
      return false
    }
  } else {
    // Insert new record
    const { error } = await supabase
      .from('coupon_usage')
      .insert({
        coupon_id: couponId,
        used_count: usageCount,
        fully_used: fullyUsed,
        user_email: 'teerawat2545.game@gmail.com'
      })
      
    if (error) {
      console.error('Error inserting coupon usage:', error)
      return false
    }
  }
  
  return true
}