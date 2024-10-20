function CharacterPanel() {
  const { character, localCharacter, userLevel, playerName } =
    useContext(AppContext);
  const characterInfo = CHARACTERS.find((c) => c.name === character);

  return (
    <div className="h-full flex flex-col">
      <h2 className="text-2xl font-bold mb-4">Character Info</h2>
      <div className="flex-grow flex flex-col items-center justify-center">
        <img
          src={characterImageMap[character?.toLowerCase() || ""]}
          alt={character || ""}
          className="w-32 h-32 rounded-full mb-4"
        />
        <p className="text-xl font-semibold">{characterInfo?.characterName}</p>
        <p>
          Level {userLevel} {localCharacter}
        </p>
      </div>
      <div className="mt-4">
        <p className="font-semibold">Player: {playerName}</p>
        <p>Weakness: {characterInfo?.secretWeakness}</p>
      </div>
    </div>
  );
}
