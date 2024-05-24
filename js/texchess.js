const algebraic_y = [1, 2, 3, 4, 5, 6, 7, 8]
const algebraic_x = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']
const descriptive_y = Array.from(algebraic_y)
const descriptive_x = ['QR', 'QN', 'QB', 'Q', 'K', 'KB', 'KN', 'KR']
const first_line_pieces = ['QRP', 'QNP', 'QBP', 'QP', 'KP', 'KBP', 'KNP', 'KRP']
const second_line_pieces = ['QR', 'QN', 'QB', 'Q', 'K', 'KB', 'KN', 'KR']
const representational_map_white = {
  'P': '♙',
  'R': '♖',
  'N': '♘',
  'B': '♗',
  'Q': '♕',
  'K': '♔',
}
const representational_map_black = {
  'P': '♟',
  'R': '♜',
  'N': '♞',
  'B': '♝',
  'Q': '♛',
  'K': '♚',
}

const build_position_map = (x, y) => {
  const res = []
  for (const j of Array.from(y).reverse()) {
    for (const i of x) {
      res.push(`${i}${j}`)
    }
  }
  return res
}

const build_start_board = (whites_up = false) => {
  const res = []
  for (const j of Array.from(algebraic_y).reverse()) {
    switch (j) {
      case 8:
        res.push(...(whites_up ? second_line_pieces.map((p) => p.concat('w')) : second_line_pieces.map((p) => p.concat('b'))))
        break;
      case 7:
        res.push(...(whites_up ? first_line_pieces.map((p) => p.concat('w')) : first_line_pieces.map((p) => p.concat('b'))))
        break;
      case 2:
        res.push(...(whites_up ? first_line_pieces.map((p) => p.concat('b')) : first_line_pieces.map((p) => p.concat('w'))))
        break;
      case 1:
        res.push(...(whites_up ? second_line_pieces.map((p) => p.concat('b')) : second_line_pieces.map((p) => p.concat('w'))))
      default:
        res.push(...Array(8).fill('*'))
        break;
    }
  }
  return res
}

export const pretty_print = (board) => {
  let res = ''
  for (let j = 0; j < 8; j++) {
    for (let i = 0; i < 8; i++) {
      res += ` ${board[(j * 8) + i]}${i === 8 - 1 ? ' ' : ''}`
    }
    res += `\n`
  }
  return res
}

export const pretty_print_pieces = (board) => {
  let res = ''
  for (let j = 0; j < 8; j++) {
    for (let i = 0; i < 8; i++) {
      const data = board[(j * 8) + i]
      if (data === '*') {
        res += ` -${i === 8 - 1 ? ' ' : ''}`
      } else {
        const color = data.slice(-1)
        const piece = data.slice(-2, -1)
        const representational_piece = color === 'w' ? representational_map_white[piece] : representational_map_black[piece]
        res += ` ${representational_piece}${i === 8 - 1 ? ' ' : ''}`
      }
    }
    res += `\n`
  }
  return res
}

const notation_to_arraypos = (n) => {
  const a = algebraic_chessboard.indexOf(n)
  const b = descriptive_chessboard.indexOf(n)
  return Math.max(a, b)
}

const arraypos_to_notation = (p) => {
  return {
    descriptive: descriptive_chessboard[p],
    algebraic: algebraic_chessboard[p]
  }
}


const build_initial_pieces_state = (whites_up = false) => {
  const res = {}
  for (const [index, p] of first_line_pieces.entries()) {
    const a = arraypos_to_notation((8 - 7) * 8 + index)
    res[p + (whites_up ? 'w' : 'b')] = {
      arr_index: (8 - 7) * 8 + index,
      algebraic_position: a.algebraic,
      descriptive_posiion: a.descriptive,
      possible_movements: []
    }
    const b = arraypos_to_notation((8 - 2) * 8 + index)
    res[p + (whites_up ? 'b' : 'w')] = {
      arr_index: (8 - 2) * 8 + index,
      algebraic_position: b.algebraic,
      descriptive_posiion: b.descriptive,
      possible_movements: []
    }
  }
  for (const [index, p] of second_line_pieces.entries()) {
    const a = arraypos_to_notation((8 - 8) * 8 + index)
    res[p + (whites_up ? 'w' : 'b')] = {
      arr_index: (8 - 8) * 8 + index,
      algebraic_position: a.algebraic,
      descriptive_posiion: a.descriptive,
      possible_movements: []
    }

    const b = arraypos_to_notation((8 - 1) * 8 + index)
    res[p + (whites_up ? 'b' : 'w')] = {
      arr_index: (8 - 1) * 8 + index,
      algebraic_position: b.algebraic,
      descriptive_posiion: b.descriptive,
      possible_movements: []
    }
  }
  return res
}

export const algebraic_chessboard = build_position_map(algebraic_x, algebraic_y)
export const descriptive_chessboard = build_position_map(descriptive_x, descriptive_y)
export const representational_board = build_start_board()
export const starting_pieces_states = build_initial_pieces_state()


const moves = `1 P-K4 P-K4
2 N-KB3 N-QB3
3 B-B4 N-B3
4 N-N5 P-Q4
5 PXP NxP
6 NXBP KXN
7 Q-B3+ K-K3
8 N-B3 N3-K2
9 P-Q4 P-B3
10 B-KN5 P-KR3
12 0-0-0 R-B1
13 Q-K4 RXP?
14 PXP B-N4+
15 K-N1 R-Q7
16 P-KR4 RXR+
17 RxR BxP
18 NXN PXN
19 RxP Q-N4
20 R-Q6+ K-K2
21 R-KN6 1-0`
