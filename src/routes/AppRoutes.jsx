// import React from "react";
// import { Routes, Route, Navigate } from "react-router-dom";

// // Pages
// import Login from "../pages/auth/Login";
// import Register from "../pages/auth/Register";
// import Home from "../pages/public/Home";
// // import Product from "../pages/public/Product";

// // Layout
// import MainLayout from "../components/common/MainLayout";

// // Redux
// import { useSelector } from "react-redux";

// const AppRoutes = () => {
//   const { isAuthenticated } = useSelector((state) => state.auth);

//   return (
//     <Routes>

//       {/* ALL ROUTES WITH HEADER */}
//       <Route
//         path="/Home"
//         element={
//           <MainLayout>
//             <Home />
//           </MainLayout>
//         }
//       />

//       <Route
//         path="/login"
//         element={
//           <MainLayout>
//             {!isAuthenticated ? <Login /> : <Navigate to="/" />}
//           </MainLayout>
//         }
//       />

//       <Route
//         path="/register"
//         element={
//           <MainLayout>
//             {!isAuthenticated ? <Register /> : <Navigate to="/" />}
//           </MainLayout>
//         }
//       />

//       {/* <Route
//         path="/product/:slug"
//         element={
//           <MainLayout>
//             <Product />
//           </MainLayout>
//         }
//       /> */}

//       {/* fallback */}
//       <Route path="*" element={<Navigate to="/" />} />

//     </Routes>
//   );
// };

// export default AppRoutes;



import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

// Pages
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import Home from "../pages/public/Home";
// import Product from "../pages/public/Product";

// Layout
import MainLayout from "../components/common/MainLayout";

// Redux
import { useSelector } from "react-redux";

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useSelector((state) => state.auth);
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return <MainLayout>{children}</MainLayout>;
};

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      
      {/* Protected routes with layout */}
      <Route
        path="/home"
        element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        }
      />
      
      {/* <Route
        path="/product/:slug"
        element={
          <ProtectedRoute>
            <Product />
          </ProtectedRoute>
        }
      /> */}

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default AppRoutes;