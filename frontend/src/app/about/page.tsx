'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import {
  HomeIcon,
  UserGroupIcon,
  ShieldCheckIcon,
  ChartBarIcon,
  HeartIcon,
  CheckCircleIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline';

export default function AboutPage() {
  const stats = [
    { number: '10,000+', label: 'บ้านที่ขายได้', icon: HomeIcon },
    { number: '50,000+', label: 'สมาชิกที่ไว้วางใจ', icon: UserGroupIcon },
    { number: '5+', label: 'ปีของประสบการณ์', icon: ChartBarIcon },
    { number: '99%', label: 'ความพึงพอใจลูกค้า', icon: HeartIcon }
  ];

  const features = [
    {
      icon: ShieldCheckIcon,
      title: 'ปลอดภัยและเชื่อถือได้',
      description: 'ระบบรักษาความปลอดภัยระดับสูง ข้อมูลทุกรายการผ่านการตรวจสอบ'
    },
    {
      icon: UserGroupIcon,
      title: 'ชุมชนใหญ่',
      description: 'เครือข่ายผู้ซื้อและผู้ขายที่ใหญ่ที่สุดในประเทศไทย'
    },
    {
      icon: ChartBarIcon,
      title: 'เทคโนโลยีทันสมัย',
      description: 'ระบบค้นหาอัจฉริยะและเครื่องมือวิเคราะห์ราคาที่แม่นยำ'
    },
    {
      icon: HeartIcon,
      title: 'บริการใส่ใจ',
      description: 'ทีมงานมืออาชีพพร้อมให้คำปรึกษาตลอด 24 ชั่วโมง'
    }
  ];

  const team = [
    {
      name: 'สมชาย ใจดี',
      position: 'ผู้ก่อตั้งและ CEO',
      description: 'ประสบการณ์ 15 ปีในธุรกิจอสังหาริมทรัพย์'
    },
    {
      name: 'สมหญิง รักงาน',
      position: 'หัวหน้าฝ่ายขาย',
      description: 'ผู้เชี่ยวชาญด้านการตลาดอสังหาริมทรัพย์'
    },
    {
      name: 'สมศักดิ์ เทคโน',
      position: 'หัวหน้าฝ่ายเทคโนโลยี',
      description: 'นักพัฒนาระบบที่มีประสบการณ์กว่า 10 ปี'
    }
  ];

  const milestones = [
    { year: '2019', event: 'ก่อตั้งบริษัท HouseMarket' },
    { year: '2020', event: 'เปิดตัวเว็บไซต์และมีสมาชิก 1,000 คน' },
    { year: '2021', event: 'ขยายบริการครอบคลุม 20 จังหวัด' },
    { year: '2022', event: 'เปิดตัวแอปมือถือและมีสมาชิก 10,000 คน' },
    { year: '2023', event: 'ได้รับรางวัล "เว็บไซต์อสังหาฯ ยอดเยี่ยม"' },
    { year: '2024', event: 'มีสมาชิกกว่า 50,000 คนทั่วประเทศ' }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-primary to-primary/80 text-primary-foreground py-20">
        <div className="absolute inset-0 bg-background/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fade-in hero-text">
            เกี่ยวกับ HouseMarket
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-primary-foreground/90 animate-slide-up hero-text max-w-3xl mx-auto">
            แพลตฟอร์มซื้อขายอสังหาริมทรัพย์ออนไลน์ที่ใหญ่ที่สุดในประเทศไทย 
            เชื่อมต่อผู้ซื้อและผู้ขายด้วยเทคโนโลยีที่ทันสมัย
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Stats Section */}
        <section className="mb-20">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <Card 
                key={index} 
                className="text-center hover-lift animate-scale-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardContent className="p-6">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 rounded-lg mb-4">
                    <stat.icon className="h-6 w-6 text-primary" />
                  </div>
                  <div className="text-3xl font-bold text-card-foreground mb-2">{stat.number}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Mission Section */}
        <section className="mb-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="animate-slide-right">
              <h2 className="text-3xl font-bold text-foreground mb-6">พันธกิจของเรา</h2>
              <p className="text-muted-foreground text-lg leading-relaxed mb-6">
                เราเชื่อว่าทุกคนควรมีโอกาสเข้าถึงบ้านในฝันของตนเอง HouseMarket 
                ถูกสร้างขึ้นเพื่อทำให้การซื้อขายอสังหาริมทรัพย์เป็นเรื่องง่าย โปร่งใส และปลอดภัย
              </p>
              <p className="text-muted-foreground text-lg leading-relaxed mb-8">
                ด้วยเทคโนโลยีที่ทันสมัยและทีมงานมืออาชีพ เราช่วยเชื่อมต่อผู้ซื้อและผู้ขาย
                ให้พบกันได้อย่างมีประสิทธิภาพ
              </p>
              <Link href="/contact">
                <Button className="hover:scale-105 transition-transform duration-200">
                  ติดต่อเรา
                  <ArrowRightIcon className="h-4 w-4 ml-2" />
                </Button>
              </Link>
            </div>
            <div className="animate-slide-left">
              <Card className="p-8 bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <CheckCircleIcon className="h-6 w-6 text-success" />
                    <span className="text-card-foreground">โปร่งใสและเชื่อถือได้</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircleIcon className="h-6 w-6 text-success" />
                    <span className="text-card-foreground">เทคโนโลยีที่ทันสมัย</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircleIcon className="h-6 w-6 text-success" />
                    <span className="text-card-foreground">บริการลูกค้าระดับพรีเมียม</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircleIcon className="h-6 w-6 text-success" />
                    <span className="text-card-foreground">ครอบคลุมทั่วประเทศ</span>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="mb-20">
          <div className="text-center mb-12 animate-fade-in">
            <h2 className="text-3xl font-bold text-foreground mb-4">ทำไมต้องเลือกเรา</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              เราให้บริการที่ครบครันและมีคุณภาพเพื่อให้คุณได้รับประสบการณ์ที่ดีที่สุด
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card 
                key={index} 
                className="text-center hover-lift animate-slide-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardContent className="p-6">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
                    <feature.icon className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold text-card-foreground mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Timeline Section */}
        <section className="mb-20">
          <div className="text-center mb-12 animate-fade-in">
            <h2 className="text-3xl font-bold text-foreground mb-4">เส้นทางการเติบโต</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              ติดตามการเดินทางของเราตั้งแต่วันแรกจนถึงปัจจุบัน
            </p>
          </div>
          <div className="relative">
            <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-border"></div>
            <div className="space-y-8">
              {milestones.map((milestone, index) => (
                <div 
                  key={index} 
                  className={`flex items-center ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'} animate-fade-in`}
                  style={{ animationDelay: `${index * 0.2}s` }}
                >
                  <div className={`w-1/2 ${index % 2 === 0 ? 'pr-8 text-right' : 'pl-8 text-left'}`}>
                    <Card className="hover-lift">
                      <CardContent className="p-4">
                        <div className="text-2xl font-bold text-primary mb-2">{milestone.year}</div>
                        <p className="text-card-foreground">{milestone.event}</p>
                      </CardContent>
                    </Card>
                  </div>
                  <div className="relative z-10 w-4 h-4 bg-primary rounded-full border-4 border-background"></div>
                  <div className="w-1/2"></div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="mb-20">
          <div className="text-center mb-12 animate-fade-in">
            <h2 className="text-3xl font-bold text-foreground mb-4">ทีมงานของเรา</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              พบกับทีมงานมืออาชีพที่พร้อมให้บริการและสนับสนุนคุณ
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <Card 
                key={index} 
                className="text-center hover-lift animate-scale-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardContent className="p-6">
                  <div className="w-20 h-20 bg-muted rounded-full mx-auto mb-4 flex items-center justify-center">
                    <UserGroupIcon className="h-10 w-10 text-muted-foreground" />
                  </div>
                  <h3 className="text-xl font-semibold text-card-foreground mb-2">
                    {member.name}
                  </h3>
                  <p className="text-primary font-medium mb-3">{member.position}</p>
                  <p className="text-muted-foreground text-sm">{member.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="text-center">
          <Card className="bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20 animate-fade-in">
            <CardContent className="p-12">
              <h2 className="text-3xl font-bold text-card-foreground mb-4">
                พร้อมที่จะเริ่มต้นแล้วหรือยัง?
              </h2>
              <p className="text-muted-foreground text-lg mb-8 max-w-2xl mx-auto">
                เข้าร่วมกับเราวันนี้และค้นพบโอกาสใหม่ๆ ในการซื้อขายอสังหาริมทรัพย์
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/register">
                  <Button size="lg" className="hover:scale-105 transition-transform duration-200">
                    สมัครสมาชิกฟรี
                  </Button>
                </Link>
                <Link href="/search">
                  <Button 
                    size="lg" 
                    variant="outline" 
                    className="hover:scale-105 transition-transform duration-200"
                  >
                    เริ่มค้นหาบ้าน
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}