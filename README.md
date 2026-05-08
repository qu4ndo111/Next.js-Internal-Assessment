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

## What this project demonstrates

- **Assessment Management**: List view with search, filter by status and priority.
- **Detailed Assessment View**: Inspect individual assessment details and history.
- **Quick Review**: Actions to approve, reject, or request more information.
- **Reporting Dashboard**: Interactive charts (Recharts) and KPI cards visualizing claim volume, types, processing time trends, and approval rates.
- **Data Export**: Export filtered assessment reports to CSV with localized headers and data mapping.
- **Internationalization (i18n)**: Full support for English and Vietnamese languages using `next-intl`.
- **Responsive UI**: A modern, mobile-friendly interface with sidebar navigation and light/dark mode support.

## Tech Stack

- **Framework**: Next.js (App Router)
- **Styling**: Tailwind CSS
- **Components**: shadcn/ui
- **Charts**: Recharts
- **State Management**: Redux Toolkit
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

## Project structure

```
app/                    # App Router routes and layouts
├── (auth)/             # Authentication (Login)
└── (dashboard)/        # Main features (Dashboard, Assessments, Reports)
src/                    # Source code and shared logic
├── components/         # UI Components (shadcn/ui and shared)
├── i18n/               # Internationalization configuration
├── services/           # Data services and mock API
└── store/              # Redux state management
```

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

## Tính năng

- **Quản lý Hồ sơ**: Xem danh sách với tìm kiếm, lọc theo trạng thái và mức độ ưu tiên.
- **Chi tiết Hồ sơ**: Kiểm tra thông tin chi tiết và lịch sử của từng hồ sơ.
- **Duyệt nhanh (Quick Review)**: Thao tác phê duyệt, từ chối hoặc yêu cầu bổ sung thông tin.
- **Dashboard Báo cáo**: Biểu đồ tương tác (Recharts) và thẻ KPI trực quan hóa số lượng yêu cầu, loại hình, xu hướng thời gian xử lý và tỷ lệ phê duyệt.
- **Xuất Dữ liệu**: Xuất báo cáo dữ liệu đã lọc ra file CSV, hỗ trợ tiêu đề và giá trị được dịch sang ngôn ngữ tương ứng.
- **Đa Ngôn ngữ (i18n)**: Hỗ trợ hoàn chỉnh Tiếng Anh và Tiếng Việt sử dụng `next-intl`.
- **Giao diện Responsive**: Giao diện hiện đại, thân thiện với thiết bị di động, tích hợp thanh điều hướng (sidebar) và hỗ trợ chế độ Tối/Sáng (Dark mode).

## Công nghệ Sử dụng

- **Framework**: Next.js (App Router)
- **Styling**: Tailwind CSS
- **Components**: shadcn/ui
- **Charts**: Recharts
- **State Management**: Redux Toolkit
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

## Cấu trúc thư mục

```
app/                    # App Router routes và layouts
├── (auth)/             # Tính năng xác thực (Đăng nhập)
└── (dashboard)/        # Tính năng chính (Dashboard, Hồ sơ, Báo cáo)
src/                    # Mã nguồn và logic dùng chung
├── components/         # Giao diện UI (shadcn/ui và component dùng chung)
├── i18n/               # Cấu hình đa ngôn ngữ
├── services/           # Xử lý dữ liệu và mock API
└── store/              # Quản lý state bằng Redux
```
