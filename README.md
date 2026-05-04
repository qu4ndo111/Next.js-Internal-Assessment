[English](#english) | [Tiếng Việt](#tiếng-việt)

---

<a id="english"></a>
# Internal Assessment & Reporting Platform

A simplified, production-ready version of an internal assessment and reporting system built for the AZINSU ecosystem.

Live demo: [nextjs-internal-assessment](https://nextjs-internal-assessment.vercel.app/)

Login credentials:

```
Email:    admin@aq.com
Password: 123456aA@
```

## Business Problem

Insurance assessors need a centralized platform to manage, review, and analyze claim assessments efficiently. The system must provide clear data visualization to track key performance indicators (KPIs) and processing times, helping management make data-driven decisions.

## Core Features

- **Assessment Management**: View, filter, and sort a comprehensive list of claim assessments.
- **Detailed Assessment View**: Inspect individual assessment details, including priority, amounts, and internal notes.
- **Quick Review**: Quickly approve, reject, or request more information for assessments.
- **Reporting Dashboard**: Interactive charts and KPI cards visualizing claim volume, types, processing time trends, and approval rates.
- **Data Export**: Export filtered assessment reports to CSV with localized headers and data mapping.
- **Internationalization (i18n)**: Full support for English and Vietnamese languages across the entire application.
- **Responsive UI**: A modern, mobile-friendly interface with sidebar navigation and light/dark mode support.

## Tech Stack

- **Framework**: Next.js (App Router), React
- **Styling**: Tailwind CSS
- **Components**: shadcn/ui
- **Charts**: Recharts
- **i18n**: next-intl

## Getting Started

First, install the dependencies:

```bash
npm install
```

Then, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

---

<a id="tiếng-việt"></a>
# Nền tảng Đánh giá & Báo cáo Nội bộ

Phiên bản tối giản, đạt chuẩn production của hệ thống đánh giá và báo cáo nội bộ.

Demo trực tuyến: [nextjs-internal-assessment](https://nextjs-internal-assessment.vercel.app/)

Thông tin đăng nhập:

```
Email:    admin@aq.com
Password: 123456aA@
```

## Bài toán Nghiệp vụ

Các chuyên viên thẩm định bảo hiểm cần một nền tảng tập trung để quản lý, phê duyệt và phân tích các hồ sơ bồi thường một cách hiệu quả. Hệ thống phải cung cấp khả năng trực quan hóa dữ liệu rõ ràng để theo dõi các chỉ số hiệu suất chính (KPI) và thời gian xử lý, giúp ban quản lý đưa ra các quyết định dựa trên dữ liệu.

## Tính năng Cốt lõi

- **Quản lý Hồ sơ**: Xem, lọc và sắp xếp danh sách tổng hợp các hồ sơ thẩm định bồi thường.
- **Chi tiết Hồ sơ**: Kiểm tra thông tin chi tiết của từng hồ sơ, bao gồm mức độ ưu tiên, số tiền và ghi chú nội bộ.
- **Duyệt nhanh (Quick Review)**: Dễ dàng phê duyệt, từ chối hoặc yêu cầu bổ sung thông tin cho hồ sơ.
- **Dashboard Báo cáo**: Biểu đồ tương tác và thẻ KPI trực quan hóa số lượng yêu cầu, loại hình, xu hướng thời gian xử lý và tỷ lệ phê duyệt.
- **Xuất Dữ liệu**: Xuất báo cáo dữ liệu đã lọc ra file CSV, hỗ trợ tiêu đề và giá trị được dịch sang ngôn ngữ tương ứng.
- **Đa Ngôn ngữ (i18n)**: Hỗ trợ hoàn chỉnh Tiếng Anh và Tiếng Việt trên toàn bộ ứng dụng.
- **Giao diện Responsive**: Giao diện hiện đại, thân thiện với thiết bị di động, tích hợp thanh điều hướng (sidebar) và hỗ trợ chế độ Tối/Sáng (Dark mode).

## Công nghệ Sử dụng

- **Framework**: Next.js (App Router), React
- **Styling**: Tailwind CSS
- **Components**: shadcn/ui
- **Charts**: Recharts
- **i18n**: next-intl

## Hướng dẫn Cài đặt

Đầu tiên, cài đặt các thư viện:

```bash
npm install
```

Sau đó, khởi chạy local server:

```bash
npm run dev
```

Mở [http://localhost:3000](http://localhost:3000) trên trình duyệt để xem kết quả.
