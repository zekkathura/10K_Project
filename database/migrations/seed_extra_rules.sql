-- Seed data for extra_rules table
-- Run this AFTER add_extra_rules_table.sql
-- Note: ? and - from Excel are converted to NULL

INSERT INTO extra_rules (rule_number, text, proposer, approved_by, revoked_by, rule_date) VALUES

-- Rules 1-9
(1, 'If the person who closes first doesn''t win, the winner chooses a shot for that person', 'Ben', NULL, NULL, NULL),

(2, '"If you ain''t first you last": Upon the end of the game, anyone who has more points than the person who won (but didn''t close) must take a shot.', 'Mason', NULL, NULL, NULL),

(3, 'No table cloths', 'Paige', NULL, NULL, NULL),

(4, 'Winner finishes their beer/drink', 'Paige', NULL, NULL, NULL),

(5, 'No changing dice mid game', 'Ben', NULL, 'Kent', NULL),

(6, 'Six-Side Bust: If you six-side bust, put your forehead on the table when not rolling or drinking. Lasts until someone else six-side busts or your roll 500 or more', 'Brandon', NULL, NULL, NULL),

(7, 'Democratic vote on any new rule, tiebreaker decided by winner', NULL, NULL, NULL, NULL),

(8, 'If a die rolls off the table it''s dead (cannot be rerolled and closing isn''t possible)', 'Paige', NULL, NULL, NULL),

(9, 'On the third busteth in a row thou shalt take a shot', 'Kent', NULL, NULL, NULL),

-- Rule 10 (Rule/vote permanency section)
(10, 'Rule/vote permanency', NULL, NULL, NULL, NULL),

(11, 'One person always has to start with aqua blue dice', 'Ben', NULL, NULL, NULL),

(12, 'If you roll three 2''s and have to take it in order to keep rolling you have to keep your hands on top of your head with arms in the air until you roll a different triple', 'Brandon', NULL, NULL, NULL),

(13, 'If the way someone rolls is in question or legal, a majority vote may occur which forces the player to reroll. Tie decision goes to person who rolled.', NULL, NULL, NULL, NULL),

(14, 'If you change any of your die mid-game you have to take a shot', 'Paige', NULL, NULL, NULL),

(15, 'If you''re in first place during the game you can change your die without penalty', 'Kent', NULL, NULL, NULL),

(16, 'Last place has to roll one round and if it''s sub 500 they take a shot', 'Mason', NULL, NULL, NULL),

(17, 'You have until midnight of the day you win to make a rule', 'Mason', NULL, NULL, NULL),

(18, 'Penalty Punishment: If you get caught when you are supposed to be obeying a penalty, e.g. head should be on the table and it is not, take a shot', 'Mason', NULL, NULL, NULL),

(19, 'If you win the game you can choose to lock down your exact six die until you lose or you''ll be gone for an extended period of time.', 'Ben', NULL, NULL, NULL),

(20, 'Floor Mary: Once per game, you can voluntarily throw all 6 die on the floor at the beginning of your turn. You may not reroll them despite their outcome. If the score is below 500, the value is 0. If you roll 500 or above, the points for that roll are doubled.', 'Paige', NULL, NULL, NULL),

(21, 'Critical Failure: If you roll a six side bust while performing a floor Mary, resume normally penalty punishments for a six side bust. Any and all rules for you which mention the table are now replaced with the "floor". In addition, your die on the floor are no longer considered dead, but you must sit/stand on the floor and roll on the floor for the rest of the game.', 'Mason', NULL, NULL, NULL),

(22, 'If you say the word vibe/vibes/vibing you have to take a shot', 'Paige', NULL, NULL, '2023-06-18'),

(23, 'If a 6-of-a-kind is rolled, all other players owe the roller $5. If it is six 1s, each player owes $20 instead.', 'Brandon', NULL, NULL, NULL),

(24, 'A punishment can be avoided if the player takes a shot in its place', 'Paige', NULL, NULL, '2023-06-24'),

(25, 'Double Six-Side Bust: If you six-side bust while your head is on the table due to a previous six-side bust, you must put your head on the floor instead until you take 500 points or more', 'Brandon, Paige, Kent', NULL, NULL, '2024-01-13'),

(26, 'Replacement Theory: A player that proposes a new rule can suggest for it to replace an existing rule. If the vote passes, the new rule is instated and the old rule is eliminated.', 'Paige', 'Brandon, Kent, Paige, Mason', NULL, '2024-03-17'),

(27, 'The winner of the game chooses the music during the next game', 'Barrett', 'Brandon, Paul, Kent, Brittany, Paige', NULL, '2024-05-04'),

(28, 'If you floor Mary and lose any number of dice, you must continue the game with only the live dice. You are allowed to reroll the live dice per normal rules but must play with only live dice if you have not found the lost dice by the time your turn occurs. You must still close with 6 dice to end the game', 'Ben', 'Brandon, Mason, Paige, Kent', NULL, '2024-07-02'),

(29, 'The loser must bring a 6-pack or equivalent/greater to the Community Pool at Mage''s house. Until the contribution has been delivered the loser may not play in another game of 10K, not including subsequent games day-of. Any disputes on equivalent value of contribution shall be decided by majority vote. Rule 24 does not apply to this rule.', 'Barrett', 'Barrett, Brittany, Mason, Brandon', NULL, '2024-10-10');

-- Verify insert
SELECT COUNT(*) AS rules_inserted FROM extra_rules;
