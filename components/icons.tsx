
import React from 'react';
import { Feather } from '@expo/vector-icons';

type IconProps = Omit<React.ComponentProps<typeof Feather>, 'name'>;

export const Heart = (props: IconProps) => <Feather name="heart" {...props} />;
export const Users = (props: IconProps) => <Feather name="users" {...props} />;
export const MessageSquare = (props: IconProps) => <Feather name="message-circle" {...props} />;
export const Settings = (props: IconProps) => <Feather name="settings" {...props} />;
export const Lock = (props: IconProps) => <Feather name="lock" {...props} />;
export const User = (props: IconProps) => <Feather name="user" {...props} />;
