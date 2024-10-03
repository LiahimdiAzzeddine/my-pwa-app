import { Card as AntCard } from 'antd';

const Card = props => {
	return (
		<AntCard size="small" className={`card-container ${props.className}`}>
		{props.children}
	  </AntCard>
	);
};

export default Card;
