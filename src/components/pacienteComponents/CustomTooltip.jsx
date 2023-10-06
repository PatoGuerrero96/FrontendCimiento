import { Tooltip } from 'react-tooltip';

const CustomTooltip = ({ id, message }) => {
  return (
    <>
    <span
      className="tooltip-icon bg-blue-300 text-white rounded-full px-1.5 py-05 ml-1"
      data-tip={message}
      data-for={id}
    >
      ?
    </span>
    <Tooltip id={id} place="right" type="dark" effect="solid" />
  </>
  );
};

export default CustomTooltip;