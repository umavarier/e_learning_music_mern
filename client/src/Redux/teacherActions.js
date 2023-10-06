// // teacherActions.js

// import { setTeacher } from './teacherSlice';

// export const fetchTeacherData = () => async (dispatch) => {
//   try {
//     // Replace this with your actual API request to fetch teacher data based on the token
//     const response = await fetch('/teachers/teacher-data');
//     const data = await response.json();

//     if (response.ok) {
//       dispatch(setTeacher({ id: data.id, name: data.name }));
//     }
//   } catch (error) {
//     console.error(error);
//   }
// };
