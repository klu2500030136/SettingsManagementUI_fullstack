// import axiosInstance from "../../../services/api/axios";

// export const loginUser = async (data) => {
//   const response = await axiosInstance.post("/auth/login", data);

//   return response.data;
// };




//To test login

export const loginUser = async (data) => {

  return {
    token: "fake_jwt_token",
    role: "admin",

    user: {
      id: 1,
      name: "Admin User",
      email: data.email,
    },
  };
};