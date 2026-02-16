# 🏠 Memory Room - Interactive 3D Farewell Gift

完整的、全新的、正確的版本!

## 🚀 快速開始

```bash
# 1. 安裝依賴
npm install

# 2. 啟動開發伺服器
npm run dev

# 3. 瀏覽器會自動打開 http://localhost:3000
```

## ✨ 功能

- ✅ 完整的 3D 房間與家具
- ✅ 所有家具可調整位置和旋轉
- ✅ 💾 一鍵儲存配置(右上角按鈕)
- ✅ 🔄 重置功能
- ✅ 4 個互動記憶點
- ✅ 架高床設計(床底有儲物空間)
- ✅ Leva 控制面板即時調整

## 🎯 使用方式

### 調整家具
1. 用右側 Leva 面板的滑桿調整位置
2. 每個家具都有 X, Y, Z, Rotation 控制

### 儲存配置
1. 調整到滿意的位置
2. 點擊右上角 **💾 儲存配置** 按鈕
3. 重新整理頁面會自動載入

### 重置
1. 點擊 **🔄 重置** 按鈕
2. 確認後清除所有設置
3. 重新整理頁面回到預設

## 📂 專案結構

```
memory-room/
├── index.html          # HTML 入口
├── main.jsx           # React 入口  
├── memory-room.jsx    # 主要應用
├── index.css          # 樣式
├── package.json       # 依賴
├── vite.config.js     # Vite 配置
├── tailwind.config.js # Tailwind 配置
├── postcss.config.js  # PostCSS 配置
└── .gitignore         # Git 忽略文件
```

## 🎨 自定義

### 替換照片
在 `memory-room.jsx` 中修改 `memories` 陣列的 `image` 網址

### 修改文字
修改 `memories` 陣列的 `title` 和 `description`

### 調整顏色
修改 `memories` 陣列的 `color` (Hex 顏色碼)

## 🚢 部署

```bash
# 建置
npm run build

# 部署 dist 資料夾到任何靜態主機
# 例如: Netlify, Vercel, GitHub Pages
```

## ❤️ 這是一個完整、乾淨、測試過的版本!

沒有語法錯誤,所有功能正常運作! 🎉
