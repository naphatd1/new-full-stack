'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Input from '@/components/ui/Input';
import {
  MapPinIcon,
  PhoneIcon,
  EnvelopeIcon,
  ClockIcon,
  ChatBubbleLeftRightIcon,
  UserGroupIcon,
  QuestionMarkCircleIcon
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

export default function ContactPage() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        toast.success('ส่งข้อความเรียบร้อยแล้ว เราจะติดต่อกลับโดยเร็วที่สุด');
        setFormData({
          name: '',
          email: '',
          phone: '',
          subject: '',
          message: ''
        });
      } else {
        toast.error(data.message || 'เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง');
      }
    } catch (error) {
      console.error('Contact form error:', error);
      toast.error('เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง');
    } finally {
      setLoading(false);
    }
  };

  const contactInfo = [
    {
      icon: MapPinIcon,
      title: 'ที่อยู่สำนักงาน',
      content: '123 ถนนสุขุมวิท แขวงคลองตัน เขตคลองตัน กรุงเทพฯ 10110',
      color: 'text-primary'
    },
    {
      icon: PhoneIcon,
      title: 'โทรศัพท์',
      content: '02-123-4567, 089-123-4567',
      color: 'text-success'
    },
    {
      icon: EnvelopeIcon,
      title: 'อีเมล',
      content: 'info@housemarket.com, support@housemarket.com',
      color: 'text-info'
    },
    {
      icon: ClockIcon,
      title: 'เวลาทำการ',
      content: 'จันทร์ - ศุกร์: 9:00 - 18:00\nเสาร์ - อาทิตย์: 10:00 - 16:00',
      color: 'text-warning'
    }
  ];

  const services = [
    {
      icon: ChatBubbleLeftRightIcon,
      title: 'ปรึกษาการซื้อขาย',
      description: 'ให้คำปรึกษาเรื่องการซื้อขายอสังหาริมทรัพย์'
    },
    {
      icon: UserGroupIcon,
      title: 'บริการลูกค้า',
      description: 'ช่วยเหลือและแก้ไขปัญหาการใช้งานเว็บไซต์'
    },
    {
      icon: QuestionMarkCircleIcon,
      title: 'คำถามทั่วไป',
      description: 'ตอบข้อสงสัยเกี่ยวกับบริการและการใช้งาน'
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-4xl font-bold text-foreground mb-4">ติดต่อเรา</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            มีคำถามหรือต้องการความช่วยเหลือ? เราพร้อมให้บริการคุณ
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card className="animate-slide-up">
              <CardHeader>
                <CardTitle className="text-2xl text-card-foreground">ส่งข้อความถึงเรา</CardTitle>
                <p className="text-muted-foreground">
                  กรอกแบบฟอร์มด้านล่าง เราจะติดต่อกลับโดยเร็วที่สุด
                </p>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input
                      label="ชื่อ-นามสกุล *"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      placeholder="กรอกชื่อ-นามสกุล"
                    />
                    <Input
                      label="อีเมล *"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      placeholder="example@email.com"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input
                      label="เบอร์โทรศัพท์"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="089-123-4567"
                    />
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1">
                        หัวข้อ *
                      </label>
                      <select
                        name="subject"
                        value={formData.subject}
                        onChange={handleInputChange}
                        required
                        className="w-full rounded-md border border-input bg-background text-foreground px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-colors"
                      >
                        <option value="">เลือกหัวข้อ</option>
                        <option value="buy">สอบถามการซื้อบ้าน</option>
                        <option value="sell">สอบถามการขายบ้าน</option>
                        <option value="support">ปัญหาการใช้งาน</option>
                        <option value="partnership">ความร่วมมือทางธุรกิจ</option>
                        <option value="other">อื่นๆ</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">
                      ข้อความ *
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      required
                      rows={6}
                      className="w-full rounded-md border border-input bg-background text-foreground px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-colors resize-none"
                      placeholder="กรุณาระบุรายละเอียดที่ต้องการสอบถาม..."
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full md:w-auto px-8 py-3 hover:scale-105 transition-transform duration-200"
                  >
                    {loading ? 'กำลังส่ง...' : 'ส่งข้อความ'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Contact Info & Services */}
          <div className="space-y-6">
            {/* Contact Information */}
            <Card className="animate-slide-right">
              <CardHeader>
                <CardTitle className="text-xl text-card-foreground">ข้อมูลติดต่อ</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {contactInfo.map((info, index) => (
                  <div 
                    key={index} 
                    className="flex items-start space-x-3 animate-fade-in"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className={`p-2 rounded-lg bg-muted/30 ${info.color}`}>
                      <info.icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-card-foreground mb-1">{info.title}</h4>
                      <p className="text-sm text-muted-foreground whitespace-pre-line">
                        {info.content}
                      </p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Services */}
            <Card className="animate-slide-right" style={{ animationDelay: '0.2s' }}>
              <CardHeader>
                <CardTitle className="text-xl text-card-foreground">บริการของเรา</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {services.map((service, index) => (
                  <div 
                    key={index} 
                    className="flex items-start space-x-3 p-3 rounded-lg hover:bg-muted/30 transition-colors duration-200 animate-fade-in"
                    style={{ animationDelay: `${(index + 4) * 0.1}s` }}
                  >
                    <div className="p-2 rounded-lg bg-primary/10">
                      <service.icon className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-card-foreground mb-1">{service.title}</h4>
                      <p className="text-sm text-muted-foreground">
                        {service.description}
                      </p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Quick Contact */}
            <Card className="animate-slide-right" style={{ animationDelay: '0.3s' }}>
              <CardContent className="p-6 text-center">
                <h3 className="text-lg font-semibold text-card-foreground mb-2">
                  ต้องการความช่วยเหลือด่วน?
                </h3>
                <p className="text-muted-foreground mb-4">
                  โทรหาเราได้ทันทีในเวลาทำการ
                </p>
                <Button 
                  className="w-full hover:scale-105 transition-transform duration-200"
                  onClick={() => window.open('tel:021234567')}
                >
                  <PhoneIcon className="h-4 w-4 mr-2" />
                  โทร 02-123-4567
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-16">
          <Card className="animate-slide-up" style={{ animationDelay: '0.4s' }}>
            <CardHeader className="text-center">
              <CardTitle className="text-2xl text-card-foreground">คำถามที่พบบ่อย</CardTitle>
              <p className="text-muted-foreground">
                คำตอบสำหรับคำถามที่ลูกค้าถามบ่อยที่สุด
              </p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="p-4 rounded-lg bg-muted/20 hover:bg-muted/30 transition-colors duration-200">
                    <h4 className="font-medium text-card-foreground mb-2">
                      ค่าบริการในการลงประกาศเท่าไหร่?
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      การลงประกาศขายบ้านฟรี! ไม่มีค่าใช้จ่ายใดๆ สำหรับการลงประกาศพื้นฐาน
                    </p>
                  </div>
                  <div className="p-4 rounded-lg bg-muted/20 hover:bg-muted/30 transition-colors duration-200">
                    <h4 className="font-medium text-card-foreground mb-2">
                      ใช้เวลานานแค่ไหนในการอนุมัติประกาศ?
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      โดยปกติใช้เวลา 1-2 วันทำการ หลังจากตรวจสอบข้อมูลและรูปภาพแล้ว
                    </p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="p-4 rounded-lg bg-muted/20 hover:bg-muted/30 transition-colors duration-200">
                    <h4 className="font-medium text-card-foreground mb-2">
                      สามารถแก้ไขประกาศหลังจากลงแล้วได้ไหม?
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      ได้ครับ สามารถเข้าไปแก้ไขข้อมูลในหน้า &quot;บ้านของฉัน&quot; ได้ตลอดเวลา
                    </p>
                  </div>
                  <div className="p-4 rounded-lg bg-muted/20 hover:bg-muted/30 transition-colors duration-200">
                    <h4 className="font-medium text-card-foreground mb-2">
                      มีบริการช่วยถ่ายรูปบ้านไหม?
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      มีครับ เรามีบริการถ่ายรูปมืออาชีพ สอบถามรายละเอียดได้ที่ 02-123-4567
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}