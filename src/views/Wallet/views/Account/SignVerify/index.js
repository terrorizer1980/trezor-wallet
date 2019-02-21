/* @flow */
import React, { Component } from 'react';
import styled from 'styled-components';
import Input from 'components/inputs/Input';
import Textarea from 'components/Textarea';
import Title from 'views/Wallet/components/Title';
import Button from 'components/Button';
import Content from 'views/Wallet/components/Content';
import colors from 'config/colors';
import { SCREEN_SIZE } from 'config/variables';
import { FormattedMessage } from 'react-intl';

import l10nCommonMessages from 'views/common.messages';
import l10nMessages from './index.messages';

import type { Props } from './Container';

const Wrapper = styled.div`
    display: flex;
    flex: 1;
    flex-direction: row;
    flex-wrap: wrap;
    background: ${colors.WHITE};
`;

const Row = styled.div`
    padding-bottom: 28px;
`;

const RowButtons = styled(Row)`
    display: flex;
    align-items: center;
    justify-content: flex-end;

    @media all and (max-width: 850px) {
        flex-wrap: wrap;
        margin: -5px;
    }
`;

const StyledButton = styled(Button)`
    width: 110px;
    margin-left: 10px;

    &:first-child {
        margin-left: 0;
    }

    @media all and (max-width: 850px) {
        flex: 1;
        margin: 5px;

        &:first-child {
            margin-left: 5px;
        }
    }
`;

const Column = styled.div`
    display: flex;
    flex: 1 1 50%;
    flex-direction: column;

    @media screen and (max-width: ${SCREEN_SIZE.XS}) {
        flex: 1 1 100%;
    }
`;

const Sign = styled(Column)``;

const Verify = styled(Column)`
    padding-left: 20px;

    @media screen and (max-width: ${SCREEN_SIZE.XS}) {
        padding-left: 0px;
    }
`;

class SignVerify extends Component <Props> {
    getError(inputName: string) {
        if (!this.props.signVerify) return null;
        return this.props.signVerify.errors.find(e => e.inputName === inputName);
    }

    handleInputChange = (event: SyntheticInputEvent<Text>) => {
        this.props.signVerifyActions.inputChange(event.target.name, event.target.value);
    }

    render() {
        const device = this.props.wallet.selectedDevice;
        const {
            account, discovery, shouldRender,
        } = this.props.selectedAccount;

        if (!device || !account || !discovery || !shouldRender) {
            const { loader, exceptionPage } = this.props.selectedAccount;
            return <Content loader={loader} exceptionPage={exceptionPage} isLoading />;
        }

        const {
            signVerifyActions,
            signVerify: {
                signMessage,
                signSignature,
                verifyAddress,
                verifyMessage,
                verifySignature,
                errors,
            },
        } = this.props;
        const verifyAddressError = this.getError('verifyAddress');
        return (
            <Content>
                <Wrapper>
                    <Sign>
                        <Title><FormattedMessage {...l10nMessages.TR_SIGN_MESSAGE} /></Title>
                        <Row>
                            <Input
                                topLabel={this.props.intl.formatMessage(l10nCommonMessages.TR_ADDRESS)}
                                name="signAddress"
                                value={account.descriptor}
                                type="text"
                                autoSelect
                                readOnly
                            />
                        </Row>
                        <Row>
                            <Textarea
                                topLabel={this.props.intl.formatMessage(l10nMessages.TR_MESSAGE)}
                                name="signMessage"
                                value={signMessage}
                                onChange={this.handleInputChange}
                                rows={4}
                                maxRows={4}
                                maxLength={255}
                            />
                        </Row>
                        <Row>
                            <Textarea
                                topLabel={this.props.intl.formatMessage(l10nMessages.TR_SIGNATURE)}
                                name="signSignature"
                                value={signSignature}
                                rows={4}
                                autoSelect
                                maxRows={4}
                                maxLength={255}
                                readOnly
                            />
                        </Row>
                        <RowButtons>
                            <StyledButton
                                onClick={this.props.signVerifyActions.clearSign}
                                isWhite
                            >
                                <FormattedMessage {...l10nCommonMessages.TR_CLEAR} />
                            </StyledButton>
                            <StyledButton
                                onClick={() => signVerifyActions.sign(account.accountPath, signMessage)}
                            ><FormattedMessage {...l10nMessages.TR_SIGN} />
                            </StyledButton>
                        </RowButtons>
                    </Sign>
                    <Verify>
                        <Title><FormattedMessage {...l10nMessages.TR_VERIFY_MESSAGE} /></Title>
                        <Row>
                            <Input
                                topLabel={this.props.intl.formatMessage(l10nCommonMessages.TR_ADDRESS)}
                                autoSelect
                                name="verifyAddress"
                                value={verifyAddress}
                                onChange={this.handleInputChange}
                                type="text"
                                state={verifyAddressError ? 'error' : null}
                                bottomText={verifyAddressError ? verifyAddressError.message : null}
                            />
                        </Row>
                        <Row>
                            <Textarea
                                topLabel={this.props.intl.formatMessage(l10nMessages.TR_MESSAGE)}
                                name="verifyMessage"
                                value={verifyMessage}
                                onChange={this.handleInputChange}
                                rows={4}
                                maxRows={4}
                                maxLength={255}
                            />
                        </Row>
                        <Row>
                            <Textarea
                                topLabel={this.props.intl.formatMessage(l10nMessages.TR_SIGNATURE)}
                                autoSelect
                                name="verifySignature"
                                value={verifySignature}
                                onChange={this.handleInputChange}
                                rows={4}
                                maxRows={4}
                                maxLength={255}
                            />
                        </Row>
                        <RowButtons>
                            <StyledButton
                                onClick={signVerifyActions.clearVerify}
                                isWhite
                            >
                                <FormattedMessage {...l10nCommonMessages.TR_CLEAR} />
                            </StyledButton>
                            <StyledButton
                                onClick={
                                    () => {
                                        if (errors.length <= 0) {
                                            signVerifyActions.verify(
                                                verifyAddress,
                                                verifyMessage,
                                                verifySignature,
                                            );
                                        }
                                    }
                                }
                            >
                                <FormattedMessage {...l10nMessages.TR_VERIFY} />
                            </StyledButton>
                        </RowButtons>
                    </Verify>
                </Wrapper>
            </Content>
        );
    }
}

export default SignVerify;