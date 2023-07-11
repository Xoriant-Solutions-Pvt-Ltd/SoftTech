import React from 'react';

function StatusCellRenderer(props) {
	return (
		<div style={{ padding: "5px 15px 0 15px", lineHeight: "initial", display: "flex", justifyContent: "center" }}>
			{
                props.value === "InStock" ? 
                    <div style={{ background: "lightGreen", color: "green", fontSize: "0.8rem", fontWeight: "500", padding: "5px 20px 5px 20px", textAlign: "center", border: "1px solid lightGrey", borderRadius: "15px" }}>In Stock</div>
                    : <div style={{ background: "#FF9999", color: "red", fontSize: "0.8rem", fontWeight: "500", padding: "5px 20px 5px 20px", textAlign: "center", border: "1px solid lightGrey", borderRadius: "15px" }}>Out Of Stock</div>
            }
		</div>
	);
}

export default StatusCellRenderer;