import React, { useState } from 'react';
import { MdChangeCircle, MdClose } from 'react-icons/md';
import randomHexa from '../../utils/randomHexa';
interface Props {
  closeLabelModal: () => void;
}

const LabelModal = ({ closeLabelModal }: Props) => {
  return (
    <div className="fixed w-screen  h-screen top-0 left-0 flex items-center justify-center bg-slate-900/60">
      <div className="relative open-label-modal bg-[var(--dark-slate)] shadow-lg p-4 shadow-slate-800 rounded w-96 h-96">
        LabelModal
        <MdClose
          className="absolute right-1 top-1 hover:cursor-pointer"
          onClick={closeLabelModal}
          size={20}
        />
        <LabelForm />
      </div>
    </div>
  );
};

const LabelForm = () => {
  const [color, setColor] = useState<string>(randomHexa(6));

  return (
    <form>
      <input
        type="text"
        placeholder="Label name"
        className="label-input w-full bg-transparent border border-slate-400 px-1 py-px rounded "
      />
      <span className="text-sm text-slate-600">Max characters: 24</span>
      <div className="flex justify-center relative">
        <label htmlFor="selectColor" className="absolute left-0 text-sm">
          <MdChangeCircle style={{ fill: `${color}` }} size={27} />
        </label>
        <input
          type="color"
          id="selectColor"
          onChange={(e) => setColor(e.target.value)}
          className=" w-6 h-6 bg-transparent border-none hidden"
        />
        <label
          htmlFor="labelColor"
          className="absolute right-0 top-0.5 w-6 h-6 rounded-full"
          style={{ backgroundColor: `${color}` }}
        ></label>
        <input
          style={{ border: `1px solid ${color}` }}
          className="w-10/12 bg-transparent border border-slate-400 px-1 py-px rounded"
          type="text"
          defaultValue={`${color}`}
          value={`${color}`}
          onChange={(e) => setColor(e.target.value)}
        />
      </div>
    </form>
  );
};

export default LabelModal;
