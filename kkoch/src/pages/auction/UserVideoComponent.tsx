import React from 'react';
import OpenViduVideoComponent from './OrVideo';

export default function UserVideoComponent({ streamManager }) {

const getNicknameTag = () => {
			// Gets the nickName of the user
		return JSON.parse(streamManager.stream.connection.data).clientData;
	}

	return (
		<div>
			{streamManager !== undefined && getNicknameTag().indexOf("관리자") !== -1 ? (
				<div className="streamcomponent" style={{ width: '300%' }}>
					<OpenViduVideoComponent streamManager={streamManager} />
					{/* <div><p>{getNicknameTag()}</p></div> */}
				</div>
			) : null}
		</div>
	);
}