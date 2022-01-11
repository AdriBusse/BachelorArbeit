
import router, { useRouter } from 'next/router';
import React from 'react';
import SubmitPost from '../../../pageComponents/r/[sub]/[identifier]/SubmitPost';


function submit() {
  const router = useRouter();

  const { sub: subName } = router.query;


  return <SubmitPost subName={String(subName)} />
}

// export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
//   try {
//     const cookie = await req.headers.cookie;

//     if (!cookie) throw new Error('Missing Auth Token Cookie');

//     return { props: {} };
//   } catch (error) {
//     // @ts-ignore
//     res.writeHead(307, { Location: '/login' }).end();
//   }
// };
export default submit