import React, { useRef } from 'react';
import AddMaterial from '../AddMaterial';
const AddOrEdit = () => {
    const materialRef = useRef()
  return (
    <div>
        <div onClick={()=>{materialRef.current.show()}}>添加</div>
      <AddMaterial refs={materialRef}/>
    </div>
  );
};
export default AddOrEdit;
