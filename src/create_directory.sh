#!/bin/bash

# Tạo thư mục chính cho các phần của ứng dụng
mkdir -p components
mkdir -p pages
mkdir -p services
mkdir -p utils
mkdir -p hooks
mkdir -p context

# Tạo các thư mục và tệp tin cho components
declare -a components=("StudentManagement" "CourseManagement" "CourseRegistration" "TuitionCalculation" "TuitionPayment" "TuitionSummary" "DebtList" "Layout" "Auth")

for component in "${components[@]}"
do
  mkdir -p "components/$component"
  touch "components/$component/$component.js"
  touch "components/$component/$component.css"
  touch "components/$component/index.js"
done

# Tạo các thư mục và tệp tin cho pages
declare -a pages=("Home" "Login" "Register" "Dashboard")

for page in "${pages[@]}"
do
  mkdir -p "pages/$page"
  touch "pages/$page/$page.js"
  touch "pages/$page/$page.css"
  touch "pages/$page/index.js"
done

# Tạo các tệp tin cho services (API calls)
touch services/api.js

# Tạo các tệp tin cho utils (helper functions)
touch utils/helpers.js

# Tạo các tệp tin cho hooks (custom hooks)
touch hooks/useAuth.js

# Tạo các tệp tin cho context (React context)
touch context/AuthContext.js

echo "Cấu trúc thư mục cho dự án React đã được tạo thành công."