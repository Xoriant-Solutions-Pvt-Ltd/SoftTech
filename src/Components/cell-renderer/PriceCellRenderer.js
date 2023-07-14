import React from 'react';

function PriceCellRenderer(props) {
	return (
		<strong>
            ${props.value}
		</strong>
	);
}

export default PriceCellRenderer;