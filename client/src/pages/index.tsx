import React, { useEffect } from 'react';
import IndexComponent from '../pageComponents/IndexComponent';


export default function Home() {



  return (
    <div>
      <IndexComponent />
    </div>
  );
}

// serverside rendering. useEffect is clientside rendering
// export const getServerSideProps: GetServerSideProps = async (context) => {
//   try {
//     //on server so no localhost needed
//     const res = await axios.get('/posts');

//     return { props: { posts: res.data } };
//   } catch (error) {
//     return { props: { error: 'Something went wrong' } };
//   }
// };
