import { memo } from 'react';
import Card from './Card';

const Cards = () => {
  return (
    <>
      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24].map(
        (item) => (
          <Card key={item} id={item}></Card>
        )
      )}
    </>
  );
};

export default memo(Cards);
