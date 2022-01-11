import React, { useEffect } from 'react';
import IndexComponent from '../pageComponents/IndexComponent';


export default function Home() {

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      window.addEventListener("load", () => {
        navigator.serviceWorker.register("/sw.js").then((registration) => {
          console.log("SW registered with scope", registration.scope);
        }, (err) => {
          console.log("SW registration failed: ", err);
        }
        )
      })
    }


  }, [])

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
