import * as Components from '../components';
import * as MobxReact from 'mobx-react';
import * as Model from '../model';
import * as React from 'react';
import { WithStore } from '../store';
import * as Types from '../types';

export interface LibrarySettingsContainerProps {
	library: Model.PatternLibrary;
}

@MobxReact.inject('store')
@MobxReact.observer
export class LibrarySettingsContainer extends React.Component<LibrarySettingsContainerProps> {
	public render(): JSX.Element {
		const props = this.props as LibrarySettingsContainerProps & WithStore;
		const capabilities = props.library.getCapabilites();
		const mayUpdate = capabilities.includes(Types.LibraryCapability.Update);
		const mayReconnect = capabilities.includes(Types.LibraryCapability.Reconnect);

		return (
			<Components.PropertyBox
				headline={props.library.getName()}
				copy={props.library.getDescription()}
				key={props.library.getId()}
			>
				{props.library.getOrigin() === Types.PatternLibraryOrigin.UserProvided && (
					<>
						<LibraryStateIndicator state={props.library.getState()} />
						<Components.PropertyBoxBar>
							<Components.ButtonGroup>
								<Components.ButtonGroup.ButtonRight>
									<>
										{mayUpdate && (
											<Components.ButtonGroupButton
												onClick={() => props.store.updatePatternLibrary(props.library)}
											>
												Update
											</Components.ButtonGroupButton>
										)}
										{!mayUpdate &&
											mayReconnect && (
												<Components.ButtonGroupButton
													onClick={() =>
														props.store.connectPatternLibrary(props.library)
													}
												>
													Connect
												</Components.ButtonGroupButton>
											)}
									</>
								</Components.ButtonGroup.ButtonRight>
							</Components.ButtonGroup>
						</Components.PropertyBoxBar>
					</>
				)}
			</Components.PropertyBox>
		);
	}
}

interface LibraryStateIndicatorProps {
	state: Types.PatternLibraryState;
}

const LibraryStateIndicator: React.SFC<LibraryStateIndicatorProps> = props => {
	const ledColor = getLedColor(props.state);
	const label = getIndicatorLabel(props.state);

	return <Components.Led ledColor={ledColor} label={label} />;
};

const getLedColor = (state: Types.PatternLibraryState): Components.LedColor => {
	switch (state) {
		case Types.PatternLibraryState.Connected:
			return Components.LedColor.Green;
		case Types.PatternLibraryState.Disconnected:
			return Components.LedColor.Orange;
		case Types.PatternLibraryState.Pristine:
		default:
			return Components.LedColor.Grey;
	}
};

const getIndicatorLabel = (state: Types.PatternLibraryState): string => {
	switch (state) {
		case Types.PatternLibraryState.Connected:
			return 'Connected';
		case Types.PatternLibraryState.Disconnected:
			return 'Disconnected';
		case Types.PatternLibraryState.Pristine:
		default:
			return 'Unknown';
	}
};
