import styles from './edit-decks.module.css';
import { rulesets } from '@/lib/defs/prints';
import { entries } from '@/lib/utils';
import { useCallback, useState } from 'react';
import { useDeckStore } from '@/hooks/useDeckStore';
import { useStore } from '@/hooks/useStore';
import { PrintList } from '@/components/ui/PrintList';
import { AssetButton } from '@/components/inputs/AssetButton';
import { Select } from '@/components/inputs/Select';
import { Text } from '@/components/ui/Text';
import { Button } from '@/components/inputs/Button';
import { getSideDeckPrintIds } from '@/lib/engine/Card';
import { Box } from '@/components/ui/Box';
import { DeckCards } from '@/lib/engine/Deck';

function useDeck(init: DeckCards) {
    const [deck, setDeck] = useState(init);
    const addCard = (id: string) => setDeck(deck => ({ ...deck, main: [...deck.main, id] }));
    const removeCard = (idx: number) => setDeck(deck => ({ ...deck, main: deck.main.filter((_, i) => i !== idx) }));
    const setSide = (ids: string[]) => setDeck(deck => ({ ...deck, side: ids }));
    return [deck, { addCard, removeCard, setSide, setDeck }] as const;
}

export default function EditDecks() {
    const [selectedDeck, setSelectedDeck] = useState('');
    const [deckNameInput, setDeckName] = useState('');
    const [selectedRuleset, setSelectedRuleset] = useState(Object.keys(rulesets)[0]);
    const [defaultSideDeckId, defaultSideDeck] = Object.entries(rulesets[selectedRuleset].sideDecks)[0];
    const [selectedSideDeck, setSelectedSideDeck] = useState(defaultSideDeckId);
    const [deck, { addCard, removeCard, setSide, setDeck }] = useDeck({
        main: [],
        side: getSideDeckPrintIds(defaultSideDeck),
    });
    const decks = useStore(useDeckStore, state => state.rulesets)?.[selectedRuleset] ?? {};

    const deckName = deckNameInput.trim();
    const noDeckSelected = !(selectedDeck && decks?.[selectedDeck]);
    const canSave = !noDeckSelected && (JSON.stringify(decks[selectedDeck]) !== JSON.stringify(deck) || deckName !== selectedDeck);
    const canMakeNew = noDeckSelected || (!!deckName && !decks?.[deckName]);

    const selectDeck = (name: string) => {
        setSelectedDeck(name);
        if (!name) return;
        setDeck(useDeckStore.getState().rulesets[selectedRuleset][name]);
        setDeckName(name);
    };
    const onDeckNameChange = (name: string) => {
        setDeckName(name);
    };
    const saveDeck = (tryRename = false) => {
        let name = deckName || selectedDeck;
        for (let i = 1; !name || (i > 1 && decks?.[name]); i++) name = `New Deck (${i})`;

        setDeckName(name);

        if (tryRename && selectedDeck && name !== selectedDeck)
            useDeckStore.getState().deleteDeck(selectedRuleset, selectedDeck);
        useDeckStore.getState().saveDeck(selectedRuleset, name, deck);
        setSelectedDeck(name);
    };
    const deleteDeck = (name: string) => {
        if (name === selectedDeck) {
            setDeck({ main: [], side: getSideDeckPrintIds(defaultSideDeck) });
            setSelectedDeck('');
        }
        useDeckStore.getState().deleteDeck(selectedRuleset, name);
    };
    const onChangeRuleset = (id: string) => {
        if (id === selectedRuleset) return;
        const defaultSideDeck = Object.keys(rulesets[id].sideDecks)[0];
        setSelectedRuleset(id);
        setSelectedSideDeck(defaultSideDeck);
        setDeck({ main: [], side: getSideDeckPrintIds(rulesets[id].sideDecks[defaultSideDeck]) });
        setDeckName('');
        setSelectedDeck('');
    };

    /* eslint-disable react-hooks/exhaustive-deps */
    const onSideDeckSelect = useCallback((id: string) => {
        setSelectedSideDeck(id);
        setSide(getSideDeckPrintIds(rulesets[selectedRuleset].sideDecks[id]));
    }, []);
    const onPrintSelect = useCallback((id: string) => addCard(id), []);
    const onDeckPrintSelect = useCallback((id: string, idx: number) => removeCard(idx), []);
    const onClearDeck = useCallback(() => setDeck(deck => ({ ...deck, main: [] })), []);
    /* eslint-enable react-hooks/exhaustive-deps */

    const sideEntries = entries(rulesets[selectedRuleset].sideDecks);
    const deckEntries = entries(decks ?? {});

    // TODO: figure out how to prevent deck select from flickering on create/rename

    return (
        <div className={styles.editor}>
            <Box className={styles.controls}>
                <div className={styles.controlsRow}>
                    <Select
                        options={entries(rulesets).map(([id, ruleset]) => [id, ruleset.name])}
                        value={selectedRuleset}
                        placeholder="Select Ruleset"
                        onSelect={id => onChangeRuleset(id)}
                    />
                    <Select
                        options={deckEntries.map(([name]) => [name, name])}
                        disabled={!deckEntries.length}
                        value={selectedDeck}
                        content={deckNameInput}
                        placeholder="Select a Deck"
                        editable
                        onSelect={name => selectDeck(name)}
                        onEdit={name => onDeckNameChange(name)}
                    />
                    <div style={{ flex: 1 }} />
                    <Button onClick={onClearDeck}>
                        <Text size={12}>Clear Deck</Text>
                    </Button>
                </div>
                <div className={styles.controlsRow}>
                    <div className={styles.actions}>
                        <AssetButton path="/assets/plus.png" title="Create New Deck" disabled={!canMakeNew} onClick={() => saveDeck()} />
                        <AssetButton path="/assets/disk.png" title="Save Deck" disabled={!canSave} onClick={() => saveDeck(true)} />
                        <AssetButton path="/assets/trash.png" title="Delete Deck" disabled={noDeckSelected} onClick={() => deleteDeck(selectedDeck!)} />
                    </div>
                    <div style={{ flex:1 }} />
                    <Text size={14}>{`${deck.main.length}`} card{deck.main.length === 1 ? '' : 's'}</Text>
                </div>
            </Box>
            <div className={styles.deck}>
                {!deck.main.length && <div className={styles.emptyDeck}>
                    <Text size={14}>No cards in your deck, add them by selecting them on the right</Text>
                </div>}
                <PrintList editable prints={deck.main} onSelect={onDeckPrintSelect} ruleset={selectedRuleset} />
            </div>
            <Box className={styles.sideDeck}>
                <PrintList stacked prints={deck.side} ruleset={selectedRuleset} />
                <div className={styles.sideDeckSelector}>
                    <Text size={14}>Side Deck:</Text>
                    <Select
                        options={sideEntries.map(([id, sideDeck]) => [id, sideDeck.name])}
                        value={selectedSideDeck}
                        onSelect={onSideDeckSelect}
                    />
                </div>
            </Box>
            <div className={styles.prints}>
                <PrintList editable showNames onSelect={onPrintSelect} ruleset={selectedRuleset} />
            </div>
        </div>
    );
}
